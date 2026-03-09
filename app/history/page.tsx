import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

function getResumeAction(reading: {
  id: string;
  birthProfileId: string | null;
  cardDraw: unknown | null;
  fiveDimensionScore: unknown | null;
  reports: Array<{ id: string }>;
}) {
  if (!reading.cardDraw) {
    return {
      href: `/card-draw?readingId=${reading.id}`,
      label: "Continue Draw"
    };
  }

  if (!reading.fiveDimensionScore || reading.reports.length === 0) {
    return {
      href: `/readings/${reading.id}`,
      label: "Finish Result"
    };
  }

  return {
    href: `/readings/${reading.id}`,
    label: "Open Result"
  };
}

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const [birthProfiles, readings] = await Promise.all([
    prisma.birthProfile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.destinyReading.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        birthProfile: true,
        cardDraw: true,
        questionnaireResult: true,
        fiveDimensionScore: true,
        reports: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    })
  ]);

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">History</div>
        <h1>{user.displayName ?? user.email}</h1>
        <p>Review your saved birth profiles, completed readings, and resume anything that stopped mid-flow.</p>
        <div className="ctaRow">
          <a className="button primary" href="/start">Start Reading</a>
          <a className="button" href="/birth-profile">Birth Profiles</a>
          <a className="button" href="/auth">Account</a>
        </div>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>Birth Profiles</h2>
          <ul>
            {birthProfiles.length ? birthProfiles.map((profile) => (
              <li key={profile.id}>
                {profile.birthLocation} · {profile.birthTime} · {formatDate(profile.createdAt)}
              </li>
            )) : <li>No saved birth profiles yet.</li>}
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Readings</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Reading</th>
                  <th>Theme</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Report</th>
                  <th>Action</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {readings.length ? readings.map((reading) => {
                  const score = reading.fiveDimensionScore;
                  const report = reading.reports[0] ?? null;
                  const themeScore = reading.theme === "CAREER"
                    ? score?.careerScore
                    : reading.theme === "WEALTH"
                      ? score?.wealthScore
                      : reading.theme === "LOVE"
                        ? score?.loveScore
                        : score?.healthScore;
                  const resume = getResumeAction(reading);

                  return (
                    <tr key={reading.id}>
                      <td><a href={`/readings/${reading.id}`}>{reading.id.slice(0, 12)}</a></td>
                      <td>{reading.theme}</td>
                      <td>{reading.status}</td>
                      <td>{themeScore ?? "-"}</td>
                      <td>{report ? report.reportVersion : "-"}</td>
                      <td>
                        <a className="tableActionLink" href={resume.href}>{resume.label}</a>
                      </td>
                      <td>{formatDate(reading.createdAt)}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7}>No readings saved under this account yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
