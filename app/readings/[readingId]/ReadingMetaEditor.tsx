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
        throw new Error(payload.error || "Failed to update reading.");
      }

      setStatus("idle");
      setMessage("Reading details updated.");
      router.refresh();
    } catch (saveError) {
      setStatus("error");
      setMessage(saveError instanceof Error ? saveError.message : "Unexpected error.");
    }
  }

  return (
    <form className="intakeForm" onSubmit={handleSave}>
      <label>
        <span>Reading title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Career Pivot - Q2 2026" />
      </label>
      <label>
        <span>Reading note</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Context, people involved, deadlines, constraints." />
      </label>
      <div className="ctaRow">
        <button className="button" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save Details"}
        </button>
      </div>
      {message ? <div className={status === "error" ? "inlineError" : "feedback success inlineNotice"}>{message}</div> : null}
    </form>
  );
}
