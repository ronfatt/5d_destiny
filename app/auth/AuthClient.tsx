"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export function AuthClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(mode === "register" ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName })
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Authentication failed.");
      }

      router.push("/history");
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setError(undefined);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authShell">
      <div className="ctaRow authTabs">
        <button className={`button ${mode === "register" ? "primary" : ""}`} type="button" onClick={() => setMode("register")}>
          Register
        </button>
        <button className={`button ${mode === "login" ? "primary" : ""}`} type="button" onClick={() => setMode("login")}>
          Login
        </button>
        <button className="button" type="button" onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>

      <form className="intakeForm" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label>
            <span>Display name</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Ron" />
          </label>
        ) : null}
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" required />
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : mode === "register" ? "Create Account" : "Sign In"}
        </button>
      </form>

      {error ? <div className="inlineError">{error}</div> : null}
    </div>
  );
}
