import { QuestionnaireForm } from "./QuestionnaireForm";

export default function QuestionnairePage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Mind And Action Intake</div>
        <h1>Capture the variables that make the model changeable.</h1>
        <p>
          This step turns the questionnaire into database records linked to a reading. It captures the two
          user-controlled variables in the five-dimension system: mind and action.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Questionnaire Intake</h2>
          <p>Use the birth profile id from the previous step to attach the answers to a reading record.</p>
          <QuestionnaireForm />
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>What Gets Stored</h2>
          <ul>
            <li>One reading record with theme and question.</li>
            <li>One questionnaire result with calculated mind and action values.</li>
            <li>One initial five-dimension input record for later scoring.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
