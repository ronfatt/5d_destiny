"use client";

import { FormEvent, useMemo, useState } from "react";

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

const initialMindAnswers = mindQuestions.map(() => 4);
const initialActionAnswers = actionQuestions.map(() => 1);

export function QuestionnaireForm() {
  const [birthProfileId, setBirthProfileId] = useState("");
  const [question, setQuestion] = useState("What is the current trend for my career?");
  const [theme, setTheme] = useState("CAREER");
  const [mindAnswers, setMindAnswers] = useState<number[]>(initialMindAnswers);
  const [actionAnswers, setActionAnswers] = useState<number[]>(initialActionAnswers);
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
        throw new Error(payload.error || "Failed to save questionnaire.");
      }

      setSubmitState({
        status: "success",
        message: "Questionnaire saved and linked to a reading record.",
        readingId: payload.data.readingId
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : "Unexpected error."
      });
    }
  }

  return (
    <form className="intakeForm" onSubmit={handleSubmit}>
      <div className="fieldGrid">
        <label>
          <span>Birth profile ID</span>
          <input
            type="text"
            placeholder="Paste the birth profile id from the previous step"
            value={birthProfileId}
            onChange={(event) => setBirthProfileId(event.target.value)}
            required
          />
        </label>

        <label>
          <span>Theme</span>
          <select value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="CAREER">Career</option>
            <option value="WEALTH">Wealth</option>
            <option value="LOVE">Love</option>
            <option value="HEALTH">Health</option>
          </select>
        </label>
      </div>

      <label>
        <span>Current question</span>
        <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} required />
      </label>

      <div className="cardSection">
        <div className="sectionHeader">
          <h3>Mind</h3>
          <p>Rate each statement from 1 to 7.</p>
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
                  setMindAnswers(next);
                }}
              />
              <strong>{mindAnswers[index]}</strong>
            </label>
          ))}
        </div>
        <div className="summaryLine">Mind average: {mindAverage.toFixed(1)}</div>
      </div>

      <div className="cardSection">
        <div className="sectionHeader">
          <h3>Action</h3>
          <p>Score each statement from 0 to 2.</p>
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
                  setActionAnswers(next);
                }}
              >
                <option value="0">0 - No</option>
                <option value="1">1 - Partial</option>
                <option value="2">2 - Yes</option>
              </select>
            </label>
          ))}
        </div>
        <div className="summaryLine">Action total: {actionTotal} / 10</div>
      </div>

      <div className="ctaRow">
        <button className="button primary" type="submit" disabled={submitState.status === "submitting"}>
          {submitState.status === "submitting" ? "Saving..." : "Save Questionnaire"}
        </button>
        <a className="button" href="/birth-profile">
          Back to Birth Profile
        </a>
      </div>

      {submitState.status !== "idle" ? (
        <div className={`feedback ${submitState.status}`}>
          <strong>{submitState.status === "success" ? "Saved" : "Status"}</strong>
          <p>{submitState.message}</p>
          {submitState.readingId ? (<>
          <code>{submitState.readingId}</code>
          <div className="ctaRow">
            <a className="button" href="/card-draw">Go To Card Draw</a>
          </div>
        </>) : null}
        </div>
      ) : null}
    </form>
  );
}
