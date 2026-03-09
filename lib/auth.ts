import crypto from "node:crypto";
import { cookies } from "next/headers";
import { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "five_dim_session";
const IDENTITY_COOKIE = "five_dim_identity";
const GUEST_EMAIL_SUFFIX = "@5ddestiny.local";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function digestToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function setIdentityCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(IDENTITY_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + SESSION_TTL_MS),
    path: "/"
  });
}

async function clearIdentityCookie() {
  const cookieStore = await cookies();
  cookieStore.set(IDENTITY_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/"
  });
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, salt, existing] = storedHash.split(":");

  if (scheme !== "scrypt" || !salt || !existing) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(existing, "hex"), Buffer.from(derived, "hex"));
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = digestToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.userSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });

  await setIdentityCookie(userId);

  await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.ACTIVE }
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.userSession.deleteMany({
      where: { tokenHash: digestToken(token) }
    });
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/"
  });

  await clearIdentityCookie();
}

export async function getIdentityUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(IDENTITY_COOKIE)?.value ?? null;
}

export async function rememberGuestIdentity(userId: string) {
  await setIdentityCookie(userId);
}

export async function claimGuestData(targetUserId: string) {
  const guestUserId = await getIdentityUserId();

  if (!guestUserId || guestUserId === targetUserId) {
    await setIdentityCookie(targetUserId);
    return { claimed: false };
  }

  const guestUser = await prisma.user.findUnique({
    where: { id: guestUserId },
    select: { id: true, email: true }
  });

  if (!guestUser || !guestUser.email.endsWith(GUEST_EMAIL_SUFFIX)) {
    await setIdentityCookie(targetUserId);
    return { claimed: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.birthProfile.updateMany({ where: { userId: guestUser.id }, data: { userId: targetUserId } });
    await tx.destinyReading.updateMany({ where: { userId: guestUser.id }, data: { userId: targetUserId } });
    await tx.membership.updateMany({ where: { userId: guestUser.id }, data: { userId: targetUserId } });
    await tx.payment.updateMany({ where: { userId: guestUser.id }, data: { userId: targetUserId } });
    await tx.enrollment.updateMany({ where: { userId: guestUser.id }, data: { userId: targetUserId } });
    await tx.certification.updateMany({ where: { userId: guestUser.id }, data: { userId: targetUserId } });
    await tx.userSession.deleteMany({ where: { userId: guestUser.id } });
    await tx.user.delete({ where: { id: guestUser.id } });
  });

  await setIdentityCookie(targetUserId);
  return { claimed: true, guestUserId };
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.userSession.findFirst({
    where: {
      tokenHash: digestToken(token),
      expiresAt: { gt: new Date() }
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          status: true
        }
      }
    }
  });

  if (!session) {
    cookieStore.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/"
    });
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
