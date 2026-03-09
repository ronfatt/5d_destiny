import { getCurrentUser } from "@/lib/auth";
import { AuthClient } from "./AuthClient";

export default async function AuthPage() {
  const user = await getCurrentUser();

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Account Access</div>
        <h1>Login and keep your readings attached to a real account.</h1>
        <p>
          Logged-in users stop creating throwaway guest profiles. New birth profiles, readings, card draws, and reports
          stay connected to the same user and become visible in history.
        </p>
        {user ? (
          <div className="feedback success">
            <strong>Signed in as {user.displayName ?? user.email}</strong>
            <p>Your next intake will attach to this account.</p>
          </div>
        ) : null}
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 7" }}>
          <h2>Email Access</h2>
          <AuthClient />
        </article>

        <article className="card" style={{ gridColumn: "span 5" }}>
          <h2>Current Rule</h2>
          <ul>
            <li>Logged-in user: new birth profiles and readings reuse the same user account.</li>
            <li>Anonymous user: the app still falls back to guest mode so the MVP pipeline keeps working.</li>
            <li>History page only shows records for the current signed-in user.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
