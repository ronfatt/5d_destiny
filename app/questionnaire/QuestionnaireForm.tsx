"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const mindQuestions = [
  "When pressure rises, I can stay clear instead of reacting impulsively.",
  "I make decisions from conviction rather than fear of loss.",
  "I can keep long-term goals in view when facing short-term emotion.",
  "I recover quickly after setbacks and return to action.",
  "I trust my own judgment without depending excessively on external validation.",
  "I can tell the difference between intuition and anxiety.",
  "I usually act from purpose rather than avoidance.",
  "My current emotional state is stable enough for important decisions.",
  "I can delay gratification when something bigger matters.",
  "I am building toward a direction that feels meaningful to me."
] as const;

const actionQuestions = [
  "I have taken concrete steps on my main goal in the last 30 days.",
  "I keep a repeatable execution rhythm instead of acting only when motivated.",
  "I track progress, review mistakes, and adjust my approach.",
  "I proactively create opportunities instead of only waiting for them.",
  "I finish important tasks instead of leaving them half-open."
] as const;

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  readingId?: string;
};

const initial心念Answers = mindQuestions.map(() => 4);
const initial行动Answers = actionQuestions.map(() => 1);

export function QuestionnaireForm({ initialBirthProfileId = "" }: { initialBirthProfileId?: string }) {
  const router = useRouter();
  const [birthProfileId, setBirthProfileId] = useState(initialBirthProfileId);
  const [question, setQuestion] = useState("我最近的事业趋势如何？");
  const [theme, set主题] = useState("CAREER");
  const [mindAnswers, set心念Answers] = useState<number[]>(initial心念Answers);
  const [actionAnswers, set行动Answers] = useState<number[]>(initial行动Answers);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const mindAverage = useMemo(() => {
    return mindAnswers.reduce((sum, value) => sum + value, 0) / mindAnswers.length;
  }, [mindAnswers]);

  const actionTotal = useMemo(() => {
    return actionAnswers.reduce((sum, value) => sum + value, 0);
  }, [actionAnswers]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/questionnaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthProfileId,
          question,
          theme,
          mindAnswers,
          actionAnswers
        })
      });

      const payload = (await response.json()) as {
        error?: string;
        data?: {
          readingId: string;
        };
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "问卷保存失败。");
      }

      setSubmitState({
        status: "success",
        message: "问卷已保存，正在跳转到抽牌。",
        readingId: payload.data.readingId
      });

      router.push(`/card-draw?readingId=${payload.data.readingId}`);
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : "发生未知错误。"
      });
    }
  }

  return (
    <form className="intakeForm" onSubmit={handleSubmit}>
      <div className="fieldGrid">
        <label>
          <span>出生资料 ID</span>
          <input
            type="text"
            placeholder="由上一步自动带入"
            value={birthProfileId}
            onChange={(event) => setBirthProfileId(event.target.value)}
            required
          />
        </label>

        <label>
          <span>主题</span>
          <select value={theme} onChange={(event) => set主题(event.target.value)}>
            <option value="CAREER">事业</option>
            <option value="WEALTH">财富</option>
            <option value="LOVE">感情</option>
            <option value="HEALTH">健康</option>
          </select>
        </label>
      </div>

      <label>
        <span>当前问题</span>
        <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} required />
      </label>

      <div className="cardSection">
        <div className="sectionHeader">
          <h3>心念</h3>
          <p>请按 1 到 7 分评分。</p>
        </div>
        <div className="questionList">
          {mindQuestions.map((item, index) => (
            <label className="questionItem" key={item}>
              <span>{index + 1}. {item}</span>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={mindAnswers[index]}
                onChange={(event) => {
                  const next = [...mindAnswers];
                  next[index] = Number(event.target.value);
                  set心念Answers(next);
                }}
              />
              <strong>{mindAnswers[index]}</strong>
            </label>
          ))}
        </div>
        <div className="summaryLine">心念 average: {mindAverage.toFixed(1)}</div>
      </div>

      <div className="cardSection">
        <div className="sectionHeader">
          <h3>行动</h3>
          <p>请按 0 到 2 分评分。</p>
        </div>
        <div className="questionList">
          {actionQuestions.map((item, index) => (
            <label className="questionItem" key={item}>
              <span>{index + 1}. {item}</span>
              <select
                value={actionAnswers[index]}
                onChange={(event) => {
                  const next = [...actionAnswers];
                  next[index] = Number(event.target.value);
                  set行动Answers(next);
                }}
              >
                <option value="0">0 - 否</option>
                <option value="1">1 - 部分符合</option>
                <option value="2">2 - 是</option>
              </select>
            </label>
          ))}
        </div>
        <div className="summaryLine">行动 total: {actionTotal} / 10</div>
      </div>

      <div className="ctaRow">
        <button className="button primary" type="submit" disabled={submitState.status === "submitting"}>
          {submitState.status === "submitting" ? "保存中..." : "保存并继续"}
        </button>
        <a className="button" href="/birth-profile">
          返回出生资料
        </a>
      </div>

      {submitState.status !== "idle" ? (
        <div className={`feedback ${submitState.status}`}>
          <strong>{submitState.status === "success" ? "已保存" : "状态"}</strong>
          <p>{submitState.message}</p>
          {submitState.readingId ? <code>{submitState.readingId}</code> : null}
        </div>
      ) : null}
    </form>
  );
}
