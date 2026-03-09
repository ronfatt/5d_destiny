import { StartReadingWizard } from "./StartReadingWizard";

export default function StartReadingPage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Single Flow</div>
        <h1>Start one reading without switching pages.</h1>
        <p>
          This wizard compresses birth intake, questionnaire, and card draw into one route. The final result page then
          completes scoring and AI report generation automatically.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Reading Wizard</h2>
          <StartReadingWizard />
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>What This Does</h2>
          <ul>
            <li>Reuses the existing production APIs.</li>
            <li>Keeps the current database model unchanged.</li>
            <li>Removes most of the manual page switching from the MVP.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
