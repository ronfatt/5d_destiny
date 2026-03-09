import { QuestionnaireForm } from "./QuestionnaireForm";

type QuestionnairePageProps = {
  searchParams: Promise<{ birthProfileId?: string }>;
};

export default async function QuestionnairePage({ searchParams }: QuestionnairePageProps) {
  const params = await searchParams;

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Mind And Action Intake</div>
        <h1>Capture the variables that make the model changeable.</h1>
        <p>
          The previous step now auto-fills the birth profile id. After this form is saved, the app sends you straight
          into card draw with the new reading id already attached.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Questionnaire Intake</h2>
          <p>Mind and action values are written to the reading and prepared for scoring.</p>
          <QuestionnaireForm initialBirthProfileId={params.birthProfileId ?? ""} />
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
