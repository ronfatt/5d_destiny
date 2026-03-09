"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export function AuthClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [email, set邮箱] = useState("");
  const [password, set密码] = useState("");
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
        throw new Error(payload.error || "认证失败。");
      }

      router.push("/history");
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "发生未知错误。");
    } finally {
      setLoading(false);
    }
  }

  async function handle退出登录() {
    setLoading(true);
    setError(undefined);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "发生未知错误。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authShell">
      <div className="ctaRow authTabs">
        <button className={`button ${mode === "register" ? "primary" : ""}`} type="button" onClick={() => setMode("register")}>
          注册
        </button>
        <button className={`button ${mode === "login" ? "primary" : ""}`} type="button" onClick={() => setMode("login")}>
          登录
        </button>
        <button className="button" type="button" onClick={handle退出登录} disabled={loading}>
          退出登录
        </button>
      </div>

      <form className="intakeForm" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label>
            <span>显示名称</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="例如：Ron" />
          </label>
        ) : null}
        <label>
          <span>邮箱</span>
          <input type="email" value={email} onChange={(event) => set邮箱(event.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          <span>密码</span>
          <input type="password" value={password} onChange={(event) => set密码(event.target.value)} placeholder="至少 8 个字符" required />
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "提交中..." : mode === "register" ? "创建账户" : "登录"}
        </button>
      </form>

      {error ? <div className="inlineError">{error}</div> : null}
    </div>
  );
}
