import { getCurrentUser } from "@/lib/auth";

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

export default async function HomePage() {
  const user = await getCurrentUser();

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
          <a className="button primary" href="/start">
            Start Birth Intake
          </a>
          <a className="button" href="/history">
            {user ? "Open History" : "Account History"}
          </a>
          <a className="button" href="/auth">
            {user ? `Signed in: ${user.displayName ?? user.email}` : "Login / Register"}
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
          <p>The app now supports guest mode and account mode. Logged-in users keep their readings under one account.</p>
          <div className="ctaRow">
            <a className="button primary" href="/start">Start Reading</a>
            <a className="button" href="/questionnaire">Questionnaire</a>
            <a className="button" href="/card-draw">Card Draw</a>
            <a className="button" href="/ai-studio">AI Studio</a>
            <a className="button" href="/history">History</a>
            <a className="button" href="/admin">Admin</a>
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Next build targets</h2>
          <ul>
            <li>Capture birth profiles and persist them to Supabase.</li>
            <li>Run the reading chain under authenticated users and preserve history.</li>
            <li>Build deeper report management and member-grade account features.</li>
          </ul>
        </article>
      </section>

      <div className="footerNote">Current app shell plus authenticated history. Full member operations still need implementation.</div>
    </main>
  );
}
