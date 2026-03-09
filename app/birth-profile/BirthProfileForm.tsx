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
      setSubmitState({ status: "error", message: "请完整填写所有必填项。" });
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
        throw new Error(payload.error || "出生资料保存失败。");
      }

      setSubmitState({
        status: "success",
        message: "出生资料已保存，正在跳转到问卷。",
        birthProfileId: payload.data.id
      });

      router.push(`/questionnaire?birthProfileId=${payload.data.id}`);
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
          <span>出生日期</span>
          <input
            type="date"
            value={form.birthDate}
            onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>出生时间</span>
          <input
            type="time"
            value={form.birthTime}
            onChange={(event) => setForm((current) => ({ ...current, birthTime: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>出生城市</span>
          <input
            type="text"
            placeholder="Kuala Lumpur"
            value={form.birthLocation}
            onChange={(event) => setForm((current) => ({ ...current, birthLocation: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>时区</span>
          <input
            type="text"
            placeholder="Asia/Kuala_Lumpur"
            value={form.timezone}
            onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>性别</span>
          <select
            value={form.gender}
            onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
          >
            <option value="UNSPECIFIED">不方便透露</option>
            <option value="MALE">男性</option>
            <option value="FEMALE">女性</option>
            <option value="OTHER">其他</option>
          </select>
        </label>
      </div>

      <div className="ctaRow">
        <button className="button primary" type="submit" disabled={!canSubmit || submitState.status === "submitting"}>
          {submitState.status === "submitting" ? "保存中..." : "保存并继续"}
        </button>
        <a className="button" href="/history">
          History
        </a>
      </div>

      {submitState.status !== "idle" ? (
        <div className={`feedback ${submitState.status}`}>
          <strong>{submitState.status === "success" ? "已保存" : "状态"}</strong>
          <p>{submitState.message}</p>
          {submitState.birthProfileId ? <code>{submitState.birthProfileId}</code> : null}
        </div>
      ) : null}
    </form>
  );
}
