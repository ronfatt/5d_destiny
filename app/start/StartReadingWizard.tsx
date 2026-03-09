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
  const [question, setQuestion] = useState("What is the current trend for my career?");
  const [theme, setTheme] = useState("CAREER");
  const [mindAnswers, setMindAnswers] = useState<number[]>(mindQuestions.map(() => 4));
  const [actionAnswers, setActionAnswers] = useState<number[]>(actionQuestions.map(() => 1));

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
        throw new Error(payload.error || "Failed to save birth profile.");
      }

      setBirthProfileId(payload.data.id);
      setStep(2);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error.");
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
          question,
          theme,
          mindAnswers,
          actionAnswers
        })
      });
      const payload = (await response.json()) as { error?: string; data?: { readingId: string } };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Failed to save questionnaire.");
      }

      setReadingId(payload.data.readingId);
      setStep(3);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error.");
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
        throw new Error(payload.error || "Failed to draw cards.");
      }

      router.push(`/readings/${payload.data.readingId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error.");
      setBusy(false);
    }
  }

  return (
    <div className="wizardShell">
      <div className="wizardProgress">
        <div className="wizardProgressBar" style={{ width: `${progress}%` }} />
      </div>
      <div className="wizardSteps">
        <span className={step >= 1 ? "active" : ""}>1. Birth</span>
        <span className={step >= 2 ? "active" : ""}>2. Mind + Action</span>
        <span className={step >= 3 ? "active" : ""}>3. Draw + Result</span>
      </div>

      {step === 1 ? (
        <form className="intakeForm" onSubmit={handleBirthSubmit}>
          <div className="fieldGrid">
            <label>
              <span>Birth date</span>
              <input type="date" value={birth.birthDate} onChange={(event) => setBirth((current) => ({ ...current, birthDate: event.target.value }))} required />
            </label>
            <label>
              <span>Birth time</span>
              <input type="time" value={birth.birthTime} onChange={(event) => setBirth((current) => ({ ...current, birthTime: event.target.value }))} required />
            </label>
            <label>
              <span>Birth city</span>
              <input type="text" value={birth.birthLocation} onChange={(event) => setBirth((current) => ({ ...current, birthLocation: event.target.value }))} required />
            </label>
            <label>
              <span>Timezone</span>
              <input type="text" value={birth.timezone} onChange={(event) => setBirth((current) => ({ ...current, timezone: event.target.value }))} required />
            </label>
            <label>
              <span>Gender</span>
              <select value={birth.gender} onChange={(event) => setBirth((current) => ({ ...current, gender: event.target.value }))}>
                <option value="UNSPECIFIED">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
          </div>
          <div className="ctaRow">
            <button className="button primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Continue"}</button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form className="intakeForm" onSubmit={handleQuestionnaireSubmit}>
          <div className="feedback success">
            <strong>Birth profile saved</strong>
            <p>{birthProfileId}</p>
          </div>

          <div className="fieldGrid">
            <label>
              <span>Theme</span>
              <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                <option value="CAREER">Career</option>
                <option value="WEALTH">Wealth</option>
                <option value="LOVE">Love</option>
                <option value="HEALTH">Health</option>
              </select>
            </label>
            <label>
              <span>Current question</span>
              <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} required />
            </label>
          </div>

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
          </div>

          <div className="ctaRow">
            <button className="button" type="button" onClick={() => setStep(1)} disabled={busy}>Back</button>
            <button className="button primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Continue"}</button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="intakeForm">
          <div className="feedback success">
            <strong>Reading ready</strong>
            <p>{readingId}</p>
          </div>
          <p>
            The last step writes the 4-card draw. After that, the result page will auto-run score and AI report.
          </p>
          <div className="ctaRow">
            <button className="button" type="button" onClick={() => setStep(2)} disabled={busy}>Back</button>
            <button className="button primary" type="button" onClick={handleCardDraw} disabled={busy}>
              {busy ? "Drawing..." : "Draw Cards And Finish"}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <div className="inlineError">{error}</div> : null}
    </div>
  );
}
