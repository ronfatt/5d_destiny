import { getCurrentUser } from "@/lib/auth";

const docs = [
  {
    title: "核心模型",
    description: "数学模型、参数表、紫微映射与结构规则。",
    href: "/birth-profile"
  },
  {
    title: "命运卡系统",
    description: "50-card data table, visual prompt guide, and Energy integration.",
    href: "/api/cards/summary"
  },
  {
    title: "平台层",
    description: "报告模板、网站信息架构、认证体系、数据库与 API 结构。",
    href: "/api/platform/summary"
  }
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">五维命运系统</div>
        <h1>从方法论文档，走到可运行的平台原型。</h1>
        <p>
          这个项目现在已经不只是文档，还包含第一层可运行实现：Prisma schema、Next.js 应用骨架，以及命运引擎、卡牌系统、报告、认证与平台架构的完整底稿。
        </p>
        <div className="ctaRow">
          <a className="button primary" href="/start">
            Start Birth Intake
          </a>
          <a className="button" href="/history">
            {user ? "打开历史记录" : "账户历史"}
          </a>
          <a className="button" href="/auth">
            {user ? `已登录：${user.displayName ?? user.email}` : "登录 / 注册"}
          </a>
        </div>
      </section>

      <section className="grid">
        {docs.map((item) => (
          <article className="card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <a className="button" href={item.href}>
              打开
            </a>
          </article>
        ))}
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>MVP 流程</h2>
          <p>平台现在同时支持游客模式和账户模式。登录后，所有读取会持续归档到同一个账户下。</p>
          <div className="ctaRow">
            <a className="button primary" href="/start">开始读取</a>
            <a className="button" href="/questionnaire">问卷</a>
            <a className="button" href="/card-draw">抽牌</a>
            <a className="button" href="/ai-studio">AI 工作台</a>
            <a className="button" href="/history">历史记录</a>
            <a className="button" href="/admin">后台</a>
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>下一步开发目标</h2>
          <ul>
            <li>继续沉淀出生资料并稳定写入 Supabase。</li>
            <li>让完整读取链在登录用户体系下稳定运行并保留历史。</li>
            <li>补更完整的报告管理和会员级账户能力。</li>
          </ul>
        </article>
      </section>

      <div className="footerNote">当前已经有应用骨架与账户历史能力，完整会员运营能力仍待继续实现。</div>
    </main>
  );
}
