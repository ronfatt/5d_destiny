import { CardDrawForm } from "./CardDrawForm";

type CardDrawPageProps = {
  searchParams: Promise<{ readingId?: string }>;
};

export default async function CardDrawPage({ searchParams }: CardDrawPageProps) {
  const params = await searchParams;

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">命运卡系统</div>
        <h1>抽取能量层，并绑定到当前 reading。</h1>
        <p>
          reading id 现在会从问卷自动带入。抽牌完成后，系统会直接把你送到结果页，并继续自动评分和生成 AI 报告。
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>抽牌</h2>
          <p>1 张原型卡、2 张能量卡、1 张事件卡，共同构成 `Energy` 变量。</p>
          <CardDrawForm initialReadingId={params.readingId ?? ""} />
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>这一步会更新</h2>
          <ul>
            <li>如数据库缺失，会先写入 50 张命运卡基础数据。</li>
            <li>为当前 reading 创建或覆盖抽牌记录。</li>
            <li>将映射后的能量值写回 `five_dimension_inputs.energy_value`。</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
