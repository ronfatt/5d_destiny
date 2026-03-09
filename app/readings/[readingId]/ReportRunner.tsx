"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function ReportRunner({ readingId, hasReport }: { readingId: string; hasReport: boolean }) {
  const router = useRouter();
  const hasAutoRun = useRef(false);
  const [status, setStatus] = useState<"idle" | "running" | "error">(hasReport ? "idle" : "running");
  const [message, setMessage] = useState<string | undefined>(
    hasReport ? undefined : "Generating AI report automatically..."
  );

  async function runReport() {
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
      setMessage(undefined);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unexpected error.");
    }
  }

  useEffect(() => {
    if (hasReport || hasAutoRun.current) {
      return;
    }

    hasAutoRun.current = true;
    void runReport();
  }, [hasReport]);

  return (
    <div className="ctaRow">
      <button className="button" type="button" onClick={runReport} disabled={status === "running"}>
        {status === "running" ? "Generating Report..." : hasReport ? "Regenerate AI Report" : "Generate AI Report"}
      </button>
      {message ? <div className={status === "error" ? "inlineError" : "feedback success inlineNotice"}>{message}</div> : null}
    </div>
  );
}
