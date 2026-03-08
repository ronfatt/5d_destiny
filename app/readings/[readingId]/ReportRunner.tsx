"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReportRunner({ readingId }: { readingId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [message, setMessage] = useState<string>();

  async function handleRun() {
    setStatus("running");
    setMessage(undefined);

    try {
      const response = await fetch(`/api/ai/readings/${readingId}/report`, {
        method: "POST"
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to generate report.");
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
      <button className="button" type="button" onClick={handleRun} disabled={status === "running"}>
        {status === "running" ? "Generating Report..." : "Generate AI Report"}
      </button>
      {message ? <div className="inlineError">{message}</div> : null}
    </div>
  );
}
