import { CardDrawForm } from "./CardDrawForm";

export default function CardDrawPage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Destiny Card System</div>
        <h1>Draw the energy layer and attach it to the current reading.</h1>
        <p>
          This step seeds the 50-card system, draws one archetype card, two energy cards, and one event card,
          then writes the mapped energy score back into the five-dimension input record.
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Card Draw</h2>
          <p>Use the reading id from the questionnaire step to bind the draw to the active reading.</p>
          <CardDrawForm />
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
