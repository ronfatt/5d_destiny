import { CardDrawForm } from "./CardDrawForm";

type CardDrawPageProps = {
  searchParams: Promise<{ readingId?: string }>;
};

export default async function CardDrawPage({ searchParams }: CardDrawPageProps) {
  const params = await searchParams;

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Destiny Card System</div>
        <h1>Draw the energy layer and attach it to the current reading.</h1>
        <p>
          The reading id now flows in automatically from questionnaire. Once the draw completes, the app sends you
          directly to the result page where scoring and AI reporting can continue.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Card Draw</h2>
          <p>One archetype, two energy cards, and one event card feed the `Energy` variable.</p>
          <CardDrawForm initialReadingId={params.readingId ?? ""} />
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>What This Updates</h2>
          <ul>
            <li>Seeds the 50-card catalog into the database if missing.</li>
            <li>Creates or replaces the card draw record for the current reading.</li>
            <li>Updates `five_dimension_inputs.energy_value` with the mapped energy score.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
