"use client";

import { useMemo, useState } from "react";
import { destinyCardSeeds } from "@/lib/destiny-cards";

type CardResponse = {
  cardKey: string;
  name: string;
  prompt: string;
  negativePrompt: string;
  imageBase64?: string;
  mimeType?: string;
};

export function AiStudioClient() {
  const [cardKey, setCardKey] = useState(destinyCardSeeds[0]?.cardKey ?? "");
  const [readingId, setReadingId] = useState("");
  const [cardStatus, setCardStatus] = useState<"idle" | "loading" | "error">("idle");
  const [reportStatus, setReportStatus] = useState<"idle" | "loading" | "error">("idle");
  const [cardMessage, setCardMessage] = useState<string>();
  const [reportMessage, setReportMessage] = useState<string>();
  const [cardResult, setCardResult] = useState<CardResponse | null>(null);
  const [reportText, setReportText] = useState("");

  const previewSrc = useMemo(() => {
    if (!cardResult?.imageBase64 || !cardResult.mimeType) return null;
    return `data:${cardResult.mimeType};base64,${cardResult.imageBase64}`;
  }, [cardResult]);

  async function generateCard(mode: "prompt" | "image") {
    setCardStatus("loading");
    setCardMessage(undefined);

    try {
      const response = await fetch("/api/ai/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardKey, mode, size: "1024x1024" })
      });
      const payload = (await response.json()) as { error?: string; data?: CardResponse };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Failed to generate card asset.");
      }

      setCardResult(payload.data);
      setCardStatus("idle");
    } catch (error) {
      setCardStatus("error");
      setCardMessage(error instanceof Error ? error.message : "Unexpected error.");
    }
  }

  async function generateReport() {
    setReportStatus("loading");
    setReportMessage(undefined);

    try {
      const response = await fetch(`/api/ai/readings/${readingId}/report`, {
        method: "POST"
      });
      const payload = (await response.json()) as { error?: string; data?: { reportText: string } };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Failed to generate AI report.");
      }

      setReportText(payload.data.reportText);
      setReportStatus("idle");
    } catch (error) {
      setReportStatus("error");
      setReportMessage(error instanceof Error ? error.message : "Unexpected error.");
    }
  }

  return (
    <section className="grid">
      <article className="card" style={{ gridColumn: "span 6" }}>
        <h2>Card Art Generator</h2>
        <p>Generate a production prompt or image for any destiny card using the OpenAI image model.</p>
        <div className="intakeForm">
          <label>
            <span>Card</span>
            <select value={cardKey} onChange={(event) => setCardKey(event.target.value)}>
              {destinyCardSeeds.map((card) => (
                <option key={card.cardKey} value={card.cardKey}>
                  {card.name}
                </option>
              ))}
            </select>
          </label>
          <div className="ctaRow">
            <button className="button" type="button" onClick={() => generateCard("prompt")} disabled={cardStatus === "loading"}>
              Build Prompt
            </button>
            <button className="button primary" type="button" onClick={() => generateCard("image")} disabled={cardStatus === "loading"}>
              {cardStatus === "loading" ? "Generating..." : "Generate Image"}
            </button>
          </div>
          {cardMessage ? <div className="inlineError">{cardMessage}</div> : null}
          {cardResult ? (
            <div className="cardSection">
              <div className="sectionHeader">
                <h3>{cardResult.name}</h3>
                <p>{cardResult.cardKey}</p>
              </div>
              <p><strong>Prompt</strong></p>
              <pre className="codeBlock">{cardResult.prompt}</pre>
              <p><strong>Negative prompt</strong></p>
              <pre className="codeBlock">{cardResult.negativePrompt}</pre>
              {previewSrc ? <img className="imagePreview" src={previewSrc} alt={cardResult.name} /> : null}
            </div>
          ) : null}
        </div>
      </article>

      <article className="card" style={{ gridColumn: "span 6" }}>
        <h2>AI Report Generator</h2>
        <p>Generate a concise reading narrative from the structured five-dimension result.</p>
        <div className="intakeForm">
          <label>
            <span>Reading ID</span>
            <input
              type="text"
              placeholder="Paste a scored reading id"
              value={readingId}
              onChange={(event) => setReadingId(event.target.value)}
            />
          </label>
          <div className="ctaRow">
            <button className="button primary" type="button" onClick={generateReport} disabled={!readingId || reportStatus === "loading"}>
              {reportStatus === "loading" ? "Generating..." : "Generate AI Report"}
            </button>
          </div>
          {reportMessage ? <div className="inlineError">{reportMessage}</div> : null}
          {reportText ? <pre className="codeBlock reportBlock">{reportText}</pre> : null}
        </div>
      </article>
    </section>
  );
}
