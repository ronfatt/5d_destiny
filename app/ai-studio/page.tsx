import { AiStudioClient } from "./AiStudioClient";

export default function AiStudioPage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">AI Studio</div>
        <h1>Use OpenAI to generate card visuals and reading narratives.</h1>
        <p>
          This layer turns the existing prompt guide, 50-card data system, and reading engine into callable AI
          workflows. It is the first AI management surface inside the app.
        </p>
      </section>
      <AiStudioClient />
    </main>
  );
}
