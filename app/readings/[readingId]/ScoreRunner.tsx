"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ScoreRunner({ readingId, hasScore }: { readingId: string; hasScore: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [message, setMessage] = useState<string>();

  async function handleRun() {
    setStatus("running");
    setMessage(undefined);

    try {
      const response = await fetch(`/api/readings/${readingId}/score`, {
        method: "POST"
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to compute score.");
      }

      router.refresh();
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unexpected error.");
    }
  }

  return (
    <div className="ctaRow">
      <button className="button primary" type="button" onClick={handleRun} disabled={status === "running"}>
        {status === "running" ? "Computing..." : hasScore ? "Recompute Score" : "Compute Score"}
      </button>
      <a className="button" href="/card-draw">
        Back to Card Draw
      </a>
      {message ? <div className="inlineError">{message}</div> : null}
    </div>
  );
}
