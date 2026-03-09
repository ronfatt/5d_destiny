import { QuestionnaireForm } from "./QuestionnaireForm";

type QuestionnairePageProps = {
  searchParams: Promise<{ birthProfileId?: string }>;
};

export default async function QuestionnairePage({ searchParams }: QuestionnairePageProps) {
  const params = await searchParams;

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">心念与行动输入</div>
        <h1>采集让模型具备可改变性的两个变量。</h1>
        <p>
          上一页已经自动带入出生资料 id。这个表单保存后，系统会直接带着新的 reading id 进入抽牌。
        </p>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>问卷录入</h2>
          <p>心念和行动值会写入 reading，供后续评分使用。</p>
          <QuestionnaireForm initialBirthProfileId={params.birthProfileId ?? ""} />
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>这一步会写入</h2>
          <ul>
            <li>一条带主题和问题的 reading 记录。</li>
            <li>一条包含心念和行动计算结果的问卷记录。</li>
            <li>一条供后续评分使用的五维输入记录。</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
