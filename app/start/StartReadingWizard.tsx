"use client";

import { useMemo, useState } from "react";
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

const initialBirth = {
  birthDate: "",
  birthTime: "",
  birthLocation: "",
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Kuala_Lumpur",
  gender: "UNSPECIFIED"
};

export function StartReadingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [birthProfileId, setBirthProfileId] = useState("");
  const [readingId, setReadingId] = useState("");

  const [birth, setBirth] = useState(initialBirth);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [question, setQuestion] = useState("我最近的事业趋势如何？");
  const [theme, set主题] = useState("CAREER");
  const [mindAnswers, set心念Answers] = useState<number[]>(mindQuestions.map(() => 4));
  const [actionAnswers, set行动Answers] = useState<number[]>(actionQuestions.map(() => 1));

  const progress = useMemo(() => (step / 3) * 100, [step]);

  async function handleBirthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);

    try {
      const response = await fetch("/api/birth-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birth)
      });
      const payload = (await response.json()) as { error?: string; data?: { id: string } };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "出生资料保存失败。");
      }

      setBirthProfileId(payload.data.id);
      setStep(2);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "发生未知错误。");
    } finally {
      setBusy(false);
    }
  }

  async function handleQuestionnaireSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);

    try {
      const response = await fetch("/api/questionnaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthProfileId,
          title,
          note,
          question,
          theme,
          mindAnswers,
          actionAnswers
        })
      });
      const payload = (await response.json()) as { error?: string; data?: { readingId: string } };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "问卷保存失败。");
      }

      setReadingId(payload.data.readingId);
      setStep(3);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "发生未知错误。");
    } finally {
      setBusy(false);
    }
  }

  async function handleCardDraw() {
    setBusy(true);
    setError(undefined);

    try {
      const response = await fetch("/api/card-draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId })
      });
      const payload = (await response.json()) as { error?: string; data?: { readingId: string } };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "抽牌失败。");
      }

      router.push(`/readings/${payload.data.readingId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "发生未知错误。");
      setBusy(false);
    }
  }

  return (
    <div className="wizardShell">
      <div className="wizardProgress">
        <div className="wizardProgressBar" style={{ width: `${progress}%` }} />
      </div>
      <div className="wizardSteps">
        <span className={step >= 1 ? "active" : ""}>1. 出生资料</span>
        <span className={step >= 2 ? "active" : ""}>2. 读取设置</span>
        <span className={step >= 3 ? "active" : ""}>3. 抽牌与结果</span>
      </div>

      {step === 1 ? (
        <form className="intakeForm" onSubmit={handleBirthSubmit}>
          <div className="fieldGrid">
            <label>
              <span>出生日期</span>
              <input type="date" value={birth.birthDate} onChange={(event) => setBirth((current) => ({ ...current, birthDate: event.target.value }))} required />
            </label>
            <label>
              <span>出生时间</span>
              <input type="time" value={birth.birthTime} onChange={(event) => setBirth((current) => ({ ...current, birthTime: event.target.value }))} required />
            </label>
            <label>
              <span>出生城市</span>
              <input type="text" value={birth.birthLocation} onChange={(event) => setBirth((current) => ({ ...current, birthLocation: event.target.value }))} required />
            </label>
            <label>
              <span>时区</span>
              <input type="text" value={birth.timezone} onChange={(event) => setBirth((current) => ({ ...current, timezone: event.target.value }))} required />
            </label>
            <label>
              <span>性别</span>
              <select value={birth.gender} onChange={(event) => setBirth((current) => ({ ...current, gender: event.target.value }))}>
                <option value="UNSPECIFIED">不方便透露</option>
                <option value="MALE">男性</option>
                <option value="FEMALE">女性</option>
                <option value="OTHER">其他</option>
              </select>
            </label>
          </div>
          <div className="ctaRow">
            <button className="button primary" type="submit" disabled={busy}>{busy ? "保存中..." : "继续"}</button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form className="intakeForm" onSubmit={handleQuestionnaireSubmit}>
          <div className="feedback success">
            <strong>出生资料已保存</strong>
            <p>{birthProfileId}</p>
          </div>

          <div className="fieldGrid">
            <label>
              <span>读取标题</span>
              <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：事业转折 - 2026 Q2" />
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
            <span>读取备注</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="记录背景、时间节点、相关人物，或这次读取的重要原因。" rows={4} />
          </label>

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
          </div>

          <div className="ctaRow">
            <button className="button" type="button" onClick={() => setStep(1)} disabled={busy}>返回</button>
            <button className="button primary" type="submit" disabled={busy}>{busy ? "保存中..." : "继续"}</button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="intakeForm">
          <div className="feedback success">
            <strong>读取已准备完成</strong>
            <p>{title || question}</p>
            <code>{readingId}</code>
          </div>
          <p>
            最后一步会写入 4 张命运卡抽牌结果。完成后，结果页会自动评分并自动生成 AI 报告。
          </p>
          <div className="ctaRow">
            <button className="button" type="button" onClick={() => setStep(2)} disabled={busy}>返回</button>
            <button className="button primary" type="button" onClick={handleCardDraw} disabled={busy}>
              {busy ? "抽牌中..." : "抽牌并完成"}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <div className="inlineError">{error}</div> : null}
    </div>
  );
}
