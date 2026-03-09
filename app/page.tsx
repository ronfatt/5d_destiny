import { getCurrentUser } from "@/lib/auth";

const flowSteps = [
  {
    title: "输入出生资料",
    description: "填写出生日期、时间、地点，建立你的命盘基础。"
  },
  {
    title: "完成简短问答",
    description: "用几组问题判断当前心念状态与行动力度。"
  },
  {
    title: "抽取命运卡",
    description: "抽出命格原型、能量状态与现实触发事件。"
  },
  {
    title: "AI生成命运报告",
    description: "输出事业、财富、感情与健康的趋势解读。"
  }
];

const outcomes = [
  {
    title: "事业趋势",
    description: "看当前阶段是上升、整理还是转折。"
  },
  {
    title: "财富节奏",
    description: "看资源积累、漏财风险与机会窗口。"
  },
  {
    title: "感情状态",
    description: "看关系模式、情绪拉扯与未来走向。"
  },
  {
    title: "健康提醒",
    description: "看压力、耗损与恢复周期。"
  }
];

const methods = [
  {
    title: "核心模型",
    description: "紫微结构、四化规则与五维评分系统。"
  },
  {
    title: "命运卡系统",
    description: "50张命运卡与能量计算机制。"
  },
  {
    title: "AI平台",
    description: "自动读取、报告生成与历史记录管理。"
  }
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main>
      <header className="siteHeader">
        <a className="brandMark" href="/">
          五维命运系统
        </a>
        <nav className="topNav">
          <a href="/">首页</a>
          <a href="/sample-report">示例报告</a>
          {user ? <a href="/history">我的报告</a> : <a href="/auth">登录</a>}
          {user ? <a href="/auth">账户</a> : <a href="/auth">注册</a>}
        </nav>
      </header>

      <section className="hero heroHome">
        <div className="eyebrow">五维命运系统</div>
        <h1>输入出生资料，获得你的命盘、命运卡与AI解读。</h1>
        <p>3分钟完成读取，获得事业、财富、感情与健康的趋势报告。</p>
        <div className="ctaRow">
          <a className="button primary" href="/start">
            开始读取
          </a>
          <a className="button" href="/sample-report">
            查看示例报告
          </a>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionLead">
          <div className="eyebrow">读取流程</div>
          <h2>你的读取流程</h2>
        </div>
        <div className="grid featureGrid">
          {flowSteps.map((item, index) => (
            <article className="card" key={item.title}>
              <div className="stepIndex">0{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionLead">
          <div className="eyebrow">读取结果</div>
          <h2>你会得到什么</h2>
        </div>
        <div className="grid featureGrid">
          {outcomes.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock">
        <div className="sectionLead">
          <div className="eyebrow">系统方法</div>
          <h2>系统方法</h2>
        </div>
        <div className="grid methodGrid">
          {methods.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="footerPanel">
        <div>
          <div className="eyebrow">准备开始</div>
          <h2>先完成第一次读取，再决定是否建立账户。</h2>
        </div>
        <div className="ctaRow">
          <a className="button primary" href="/start">
            开始读取
          </a>
          <a className="button" href="/auth">
            登录 / 注册
          </a>
          <a className="button" href="/history">
            历史记录
          </a>
        </div>
      </section>
    </main>
  );
}
