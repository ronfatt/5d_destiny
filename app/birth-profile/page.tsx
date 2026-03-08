import { BirthProfileForm } from "./BirthProfileForm";

export default function BirthProfilePage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">User Input System</div>
        <h1>Capture birth profile data before chart generation.</h1>
        <p>
          This is the first product intake screen. It writes a birth profile into the database and creates a
          temporary guest user record so the reading pipeline can proceed without a full auth system.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 7" }}>
          <h2>Birth Profile Intake</h2>
          <p>Required for Ziwei charting, timing rules, and later report generation.</p>
          <BirthProfileForm />
        </article>

        <article className="card" style={{ gridColumn: "span 5" }}>
          <h2>MVP Notes</h2>
          <ul>
            <li>Current flow stores anonymous guest submissions.</li>
            <li>Each submission creates a temporary user and one birth profile record.</li>
            <li>Next step should attach this profile to questionnaire and reading creation.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
