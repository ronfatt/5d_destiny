const docs = [
  {
    title: "Core Model",
    description: "Math model, parameter tables, Ziwei mapping, and structure rules.",
    href: "/birth-profile"
  },
  {
    title: "Card System",
    description: "50-card data table, visual prompt guide, and Energy integration.",
    href: "/api/cards/summary"
  },
  {
    title: "Platform Layer",
    description: "Report templates, web IA, certification, database, and API structure.",
    href: "/api/platform/summary"
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Five-Dimension Destiny System</div>
        <h1>From method documents to a runnable product skeleton.</h1>
        <p>
          This repository now contains the first implementation layer: Prisma schema, Next.js app shell,
          and the documentation backbone for the destiny engine, card system, reports, certification,
          and platform architecture.
        </p>
        <div className="ctaRow">
          <a className="button primary" href="/api/health">
            Start Birth Intake
          </a>
          <a className="button" href="https://github.com/ronfatt/5d_destiny">
            Open Repository
          </a>
        </div>
      </section>

      <section className="grid">
        {docs.map((item) => (
          <article className="card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <a className="button" href={item.href}>
              Open
            </a>
          </article>
        ))}
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>MVP Flows</h2>
          <p>Two working intake steps are now live in the app shell.</p>
          <div className="ctaRow">
            <a className="button primary" href="/birth-profile">Birth Profile</a>
            <a className="button" href="/questionnaire">Questionnaire</a>
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Next build targets</h2>
          <ul>
            <li>Capture birth profiles and persist them to Supabase.</li>
            <li>Implement birth profile, card draw, questionnaire, and reading endpoints.</li>
            <li>Build report pages from the existing AI report template spec.</li>
          </ul>
        </article>
      </section>

      <div className="footerNote">Current app shell only. Product logic and UI flows still need implementation.</div>
    </main>
  );
}
