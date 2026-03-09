import { getCurrentUser } from "@/lib/auth";
import { AuthClient } from "./AuthClient";

export default async function AuthPage() {
  const user = await getCurrentUser();

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">账户入口</div>
        <h1>登录后，把你的读取结果正式归档到真实账户。</h1>
        <p>
          登录后，系统将不再继续创建临时游客资料。之后的新出生资料、读取记录、抽牌结果和报告都会绑定到同一个用户，并出现在历史记录中。
        </p>
        {user ? (
          <div className="feedback success">
            <strong>当前登录：{user.displayName ?? user.email}</strong>
            <p>你接下来的输入都会绑定到这个账户。</p>
          </div>
        ) : null}
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 7" }}>
          <h2>邮箱登录 / 注册</h2>
          <AuthClient />
        </article>

        <article className="card" style={{ gridColumn: "span 5" }}>
          <h2>当前规则</h2>
          <ul>
            <li>已登录用户：新的出生资料和读取会复用当前账户。</li>
            <li>未登录用户：系统仍会回退到游客模式，保证 MVP 流程不中断。</li>
            <li>历史页只显示当前登录账户的数据。</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
