"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function ScoreRunner({ readingId, hasScore }: { readingId: string; hasScore: boolean }) {
  const router = useRouter();
  const hasAutoRun = useRef(false);
  const [status, setStatus] = useState<"idle" | "running" | "error">(hasScore ? "idle" : "running");
  const [message, setMessage] = useState<string | undefined>(hasScore ? undefined : "正在自动推演命盘与趋势...");

  async function runScore() {
    setStatus("running");
    setMessage(undefined);

    try {
      const response = await fetch(`/api/readings/${readingId}/score`, {
        method: "POST"
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "命盘推演失败。");
      }

      router.refresh();
      setStatus("idle");
      setMessage(undefined);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "发生未知错误。");
    }
  }

  useEffect(() => {
    if (hasScore || hasAutoRun.current) {
      return;
    }

    hasAutoRun.current = true;
    void runScore();
  }, [hasScore]);

  return (
    <div className="ctaRow">
      <button className="button primary" type="button" onClick={runScore} disabled={status === "running"}>
        {status === "running" ? "推演中..." : hasScore ? "重新推演" : "开始推演"}
      </button>
      <a className="button" href="/card-draw">
        返回抽牌步骤
      </a>
      {message ? <div className={status === "error" ? "inlineError" : "feedback success inlineNotice"}>{message}</div> : null}
    </div>
  );
}
