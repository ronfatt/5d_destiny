"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  birthProfileId?: string;
};

const initialState = {
  birthDate: "",
  birthTime: "",
  birthLocation: "",
  timezone:
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Kuala_Lumpur",
  gender: "UNSPECIFIED"
};

export function BirthProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const canSubmit = useMemo(() => {
    return Boolean(form.birthDate && form.birthTime && form.birthLocation.trim() && form.timezone.trim());
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setSubmitState({ status: "error", message: "Please complete all required fields." });
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/birth-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as {
        error?: string;
        data?: {
          id: string;
        };
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Failed to save birth profile.");
      }

      setSubmitState({
        status: "success",
        message: "Birth profile saved. Redirecting to questionnaire.",
        birthProfileId: payload.data.id
      });

      router.push(`/questionnaire?birthProfileId=${payload.data.id}`);
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
          <span>Birth date</span>
          <input
            type="date"
            value={form.birthDate}
            onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>Birth time</span>
          <input
            type="time"
            value={form.birthTime}
            onChange={(event) => setForm((current) => ({ ...current, birthTime: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>Birth city</span>
          <input
            type="text"
            placeholder="Kuala Lumpur"
            value={form.birthLocation}
            onChange={(event) => setForm((current) => ({ ...current, birthLocation: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>Timezone</span>
          <input
            type="text"
            placeholder="Asia/Kuala_Lumpur"
            value={form.timezone}
            onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>Gender</span>
          <select
            value={form.gender}
            onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
          >
            <option value="UNSPECIFIED">Prefer not to say</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>

      <div className="ctaRow">
        <button className="button primary" type="submit" disabled={!canSubmit || submitState.status === "submitting"}>
          {submitState.status === "submitting" ? "Saving..." : "Save And Continue"}
        </button>
        <a className="button" href="/history">
          History
        </a>
      </div>

      {submitState.status !== "idle" ? (
        <div className={`feedback ${submitState.status}`}>
          <strong>{submitState.status === "success" ? "Saved" : "Status"}</strong>
          <p>{submitState.message}</p>
          {submitState.birthProfileId ? <code>{submitState.birthProfileId}</code> : null}
        </div>
      ) : null}
    </form>
  );
}
