import { BirthProfileForm } from "./BirthProfileForm";

export default function BirthProfilePage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">用户输入系统</div>
        <h1>在生成命盘前，先录入出生资料。</h1>
        <p>
          这是当前可运行主链的第一步。出生资料保存后，系统会自动把生成的 id 带到下一步问卷。
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 7" }}>
          <h2>出生资料录入</h2>
          <p>紫微排盘、时运规则和后续报告生成都需要这一步。</p>
          <BirthProfileForm />
        </article>

        <article className="card" style={{ gridColumn: "span 5" }}>
          <h2>这一步会产生</h2>
          <ul>
            <li>保存一份出生资料到当前账户或游客账户。</li>
            <li>生成可持续使用的 `birthProfileId`。</li>
            <li>自动带着 id 跳转到问卷。</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
