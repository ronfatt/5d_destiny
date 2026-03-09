"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReadingMetaEditor({
  readingId,
  initialTitle,
  initialNote
}: {
  readingId: string;
  initialTitle: string;
  initialNote: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialNote);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string>();

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage(undefined);

    try {
      const response = await fetch(`/api/readings/${readingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, note })
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "读取信息更新失败。");
      }

      setStatus("idle");
      setMessage("读取信息已更新。");
      router.refresh();
    } catch (saveError) {
      setStatus("error");
      setMessage(saveError instanceof Error ? saveError.message : "发生未知错误。");
    }
  }

  return (
    <form className="intakeForm" onSubmit={handleSave}>
      <label>
        <span>读取标题</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：事业转折 - 2026 Q2" />
      </label>
      <label>
        <span>读取备注</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="记录背景、相关人物、时间节点或限制条件。" />
      </label>
      <div className="ctaRow">
        <button className="button" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "保存中..." : "保存信息"}
        </button>
      </div>
      {message ? <div className={status === "error" ? "inlineError" : "feedback success inlineNotice"}>{message}</div> : null}
    </form>
  );
}
