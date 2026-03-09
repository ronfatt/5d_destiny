import { StartReadingWizard } from "./StartReadingWizard";

export default function StartReadingPage() {
  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">单页流程</div>
        <h1>在一个页面里完成整条读取流程。</h1>
        <p>
          这个向导把出生资料、问卷和抽牌压缩到同一个入口。最后的结果页会自动完成评分与 AI 报告生成。
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>读取向导</h2>
          <StartReadingWizard />
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>这个入口会做什么</h2>
          <ul>
            <li>直接复用现有生产 API。</li>
            <li>不改变当前数据库模型。</li>
            <li>尽量减少 MVP 里的手动切页操作。</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
