const highlights = [
  {
    title: "事业趋势",
    score: "高势期",
    description: "当前结构稳定，时运处于上升段，适合推进项目与合作。"
  },
  {
    title: "财富节奏",
    score: "成长期",
    description: "有资源积累机会，但仍需控制短线风险与冲动投入。"
  },
  {
    title: "感情状态",
    score: "整理期",
    description: "关系中有情绪拉扯，先厘清边界比急着承诺更重要。"
  },
  {
    title: "健康提醒",
    score: "关注期",
    description: "压力消耗偏高，需要优先处理作息与恢复节奏。"
  }
];

export default function SampleReportPage() {
  return (
    <main>
      <header className="siteHeader">
        <a className="brandMark" href="/">
          五维命运系统
        </a>
        <nav className="topNav">
          <a href="/">首页</a>
          <a href="/start">开始读取</a>
          <a href="/auth">登录</a>
        </nav>
      </header>

      <section className="hero heroCompact">
        <div className="eyebrow">示例报告</div>
        <h1>这是一次完整读取后的报告样式。</h1>
        <p>你会得到四大主题的趋势判断、风险提醒与行动建议，而不是一堆系统术语。</p>
      </section>

      <section className="grid featureGrid">
        {highlights.map((item) => (
          <article className="card" key={item.title}>
            <div className="resultBadge">{item.score}</div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="sectionBlock compactSection">
        <div className="grid methodGrid">
          <article className="card" style={{ gridColumn: "span 6" }}>
            <h3>命盘结构</h3>
            <p>先看你的先天底盘，再结合当前时间窗口，判断趋势强弱。</p>
          </article>
          <article className="card" style={{ gridColumn: "span 6" }}>
            <h3>命运卡能量</h3>
            <p>用命运卡补足当下状态、阻力来源与现实触发事件。</p>
          </article>
          <article className="card" style={{ gridColumn: "span 12" }}>
            <h3>AI解读输出</h3>
            <p>最终输出会把事业、财富、感情、健康四个主题写成可读建议，而不是只给一个总分。</p>
            <div className="ctaRow">
              <a className="button primary" href="/start">
                开始我的读取
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
