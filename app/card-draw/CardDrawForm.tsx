"use client";

import { FormEvent, useState } from "react";

type DrawResponse = {
  readingId: string;
  rawEnergyScore: number;
  mappedEnergyScore: number;
  draw: {
    archetype: { name: string; value: number; polarity: string };
    energy1: { name: string; value: number; polarity: string };
    energy2: { name: string; value: number; polarity: string };
    event: { name: string; value: number; polarity: string };
  };
};

export function CardDrawForm() {
  const [readingId, setReadingId] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>();
  const [result, setResult] = useState<DrawResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage(undefined);

    try {
      const response = await fetch("/api/card-draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId })
      });

      const payload = (await response.json()) as { error?: string; data?: DrawResponse };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Failed to draw cards.");
      }

      setResult(payload.data);
      setStatus("success");
      setMessage("Cards drawn and energy value saved to the reading.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unexpected error.");
    }
  }

  return (
    <form className="intakeForm" onSubmit={handleSubmit}>
      <label>
        <span>Reading ID</span>
        <input
          type="text"
          placeholder="Paste the reading id from the questionnaire step"
          value={readingId}
          onChange={(event) => setReadingId(event.target.value)}
          required
        />
      </label>

      <div className="ctaRow">
        <button className="button primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Drawing..." : "Draw 4 Destiny Cards"}
        </button>
        <a className="button" href="/questionnaire">
          Back to Questionnaire
        </a>
      </div>

      {status !== "idle" && message ? (
        <div className={`feedback ${status === "success" ? "success" : "error"}`}>
          <strong>{status === "success" ? "Draw Complete" : "Status"}</strong>
          <p>{message}</p>
          {result ? (
            <div className="ctaRow">
              <a className="button" href={`/readings/${result.readingId}`}>Open Result Page</a>
            </div>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="drawResultGrid">
          <article className="card compactCard">
            <h3>Archetype</h3>
            <p>{result.draw.archetype.name}</p>
            <strong>{result.draw.archetype.value}</strong>
          </article>
          <article className="card compactCard">
            <h3>Energy I</h3>
            <p>{result.draw.energy1.name}</p>
            <strong>{result.draw.energy1.value}</strong>
          </article>
          <article className="card compactCard">
            <h3>Energy II</h3>
            <p>{result.draw.energy2.name}</p>
            <strong>{result.draw.energy2.value}</strong>
          </article>
          <article className="card compactCard">
            <h3>Event</h3>
            <p>{result.draw.event.name}</p>
            <strong>{result.draw.event.value}</strong>
          </article>
          <article className="card compactCard" style={{ gridColumn: "span 12" }}>
            <h3>Energy Output</h3>
            <p>Raw energy: {result.rawEnergyScore}</p>
            <strong>Mapped Energy: {result.mappedEnergyScore}</strong>
          </article>
        </div>
      ) : null}
    </form>
  );
}
