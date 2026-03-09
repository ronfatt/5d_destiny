"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getCardNameZh } from "@/lib/card-localization";

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

export function CardDrawForm({ initialReadingId = "" }: { initialReadingId?: string }) {
  const router = useRouter();
  const [readingId, setReadingId] = useState(initialReadingId);
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
        throw new Error(payload.error || "抽牌失败。");
      }

      setResult(payload.data);
      setStatus("success");
      setMessage("抽牌已完成，正在跳转到结果页。");
      router.push(`/readings/${payload.data.readingId}`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "发生未知错误。");
    }
  }

  return (
    <form className="intakeForm" onSubmit={handleSubmit}>
      <label>
        <span>Reading ID</span>
        <input
          type="text"
          placeholder="由问卷步骤自动带入"
          value={readingId}
          onChange={(event) => setReadingId(event.target.value)}
          required
        />
      </label>

      <div className="ctaRow">
        <button className="button primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "抽牌中..." : "抽牌并继续"}
        </button>
        <a className="button" href="/questionnaire">
          返回问卷
        </a>
      </div>

      {status !== "idle" && message ? (
        <div className={`feedback ${status === "success" ? "success" : "error"}`}>
          <strong>{status === "success" ? "抽牌完成" : "状态"}</strong>
          <p>{message}</p>
          {result ? <code>{result.readingId}</code> : null}
        </div>
      ) : null}

      {result ? (
        <div className="drawResultGrid">
          <article className="card compactCard">
            <h3>原型卡</h3>
            <p>{getCardNameZh(result.draw.archetype.name, result.draw.archetype.name)}</p>
            <strong>{result.draw.archetype.value}</strong>
          </article>
          <article className="card compactCard">
            <h3>能量卡一</h3>
            <p>{getCardNameZh(result.draw.energy1.name, result.draw.energy1.name)}</p>
            <strong>{result.draw.energy1.value}</strong>
          </article>
          <article className="card compactCard">
            <h3>能量卡二</h3>
            <p>{getCardNameZh(result.draw.energy2.name, result.draw.energy2.name)}</p>
            <strong>{result.draw.energy2.value}</strong>
          </article>
          <article className="card compactCard">
            <h3>事件卡</h3>
            <p>{getCardNameZh(result.draw.event.name, result.draw.event.name)}</p>
            <strong>{result.draw.event.value}</strong>
          </article>
          <article className="card compactCard" style={{ gridColumn: "span 12" }}>
            <h3>能量结果</h3>
            <p>原始能量：{result.rawEnergyScore}</p>
            <strong>映射能量：{result.mappedEnergyScore}</strong>
          </article>
        </div>
      ) : null}
    </form>
  );
}
