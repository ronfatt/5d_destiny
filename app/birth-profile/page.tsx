import { BirthProfileForm } from "./BirthProfileForm";

export default function BirthProfilePage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">User Input System</div>
        <h1>Capture birth profile data before chart generation.</h1>
        <p>
          This is the first screen in the runnable intake chain. Save the birth profile once, then the app carries the
          generated id forward automatically into the questionnaire step.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 7" }}>
          <h2>Birth Profile Intake</h2>
          <p>Required for Ziwei charting, timing rules, and later report generation.</p>
          <BirthProfileForm />
        </article>

        <article className="card" style={{ gridColumn: "span 5" }}>
          <h2>Flow Output</h2>
          <ul>
            <li>Saves one birth profile to the current account or a guest user.</li>
            <li>Generates a persistent `birthProfileId`.</li>
            <li>Redirects directly into questionnaire with the id attached.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
