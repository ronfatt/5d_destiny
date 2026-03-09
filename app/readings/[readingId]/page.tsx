import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportRunner } from "./ReportRunner";
import { ScoreRunner } from "./ScoreRunner";
import { ReadingMetaEditor } from "./ReadingMetaEditor";

type ReadingPageProps = {
  params: Promise<{ readingId: string }>;
};

export default async function ReadingResultPage({ params }: ReadingPageProps) {
  const { readingId } = await params;

  const reading = await prisma.destinyReading.findUnique({
    where: { id: readingId },
    include: {
      birthProfile: true,
      questionnaireResult: true,
      fiveDimensionInput: true,
      fiveDimensionScore: true,
      cardDraw: true,
      reports: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!reading) {
    notFound();
  }

  const latestReport = reading.reports[0] ?? null;
  const inputJson = reading.fiveDimensionInput?.inputJson as
    | {
        ziweiChartSummary?: {
          engineVersion?: string;
          school?: string;
          lifePalace?: { label?: string };
          bodyPalace?: { label?: string };
          focusTheme?: string;
        };
      }
    | undefined;

  const ziweiSummary = inputJson?.ziweiChartSummary;
  const breakdown = reading.fiveDimensionScore?.breakdownJson as
    | {
        focusTheme?: string;
        focusTrend?: string;
        themes?: Record<
          string,
          {
            label: string;
            score: number;
            trend: string;
            structure: number;
            timing: number;
            energy: number;
            mind: number;
            actionDisplay: number;
          }
        >;
      }
    | undefined;

  const themes = breakdown?.themes ? Object.entries(breakdown.themes) : [];
  const title = reading.title?.trim() || reading.question;

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">读取结果</div>
        <h1>{title}</h1>
        <p>
          这个页面汇总了出生资料、问卷、抽牌结果、评分输出、最新 AI 报告，以及已持久化的紫微摘要。结构与时运现在来自 preset_A 紫微引擎。
        </p>
        <ReadingMetaEditor readingId={reading.id} initialTitle={reading.title ?? ""} initialNote={reading.note ?? ""} />
        <ScoreRunner readingId={reading.id} hasScore={Boolean(reading.fiveDimensionScore)} />
        {reading.fiveDimensionScore ? <ReportRunner readingId={reading.id} hasReport={Boolean(latestReport)} /> : null}
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>输入快照</h2>
          <ul>
            <li>读取 ID：{reading.id}</li>
            <li>主题：{reading.theme}</li>
            <li>状态：{reading.status}</li>
            <li>问题：{reading.question}</li>
            <li>出生城市：{reading.birthProfile?.birthLocation ?? "-"}</li>
            <li>时区：{reading.birthProfile?.timezone ?? "-"}</li>
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>五维输入</h2>
          <ul>
            <li>结构：{reading.fiveDimensionInput?.structureValue ?? "-"}</li>
            <li>时运：{reading.fiveDimensionInput?.timingValue ?? "-"}</li>
            <li>能量：{reading.fiveDimensionInput?.energyValue ?? "-"}</li>
            <li>心念：{reading.fiveDimensionInput?.mindValue ?? "-"}</li>
            <li>行动：{reading.fiveDimensionInput?.actionValue ?? "-"}</li>
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>问卷</h2>
          <ul>
            <li>心念平均分：{reading.questionnaireResult?.mindAverage ?? "-"}</li>
            <li>心念系数：{reading.questionnaireResult?.mindFactor ?? "-"}</li>
            <li>行动总分：{reading.questionnaireResult?.actionTotal ?? "-"}</li>
            <li>行动原始值：{reading.questionnaireResult?.actionRaw ?? "-"}</li>
            <li>行动标签：{reading.questionnaireResult?.actionLabel ?? "-"}</li>
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>紫微摘要</h2>
          {ziweiSummary ? (
            <ul>
              <li>引擎：{ziweiSummary.engineVersion ?? "-"}</li>
              <li>流派：{ziweiSummary.school ?? "-"}</li>
              <li>命宫：{ziweiSummary.lifePalace?.label ?? "-"}</li>
              <li>身宫：{ziweiSummary.bodyPalace?.label ?? "-"}</li>
              <li>主题聚焦来源：{ziweiSummary.focusTheme ?? "-"}</li>
            </ul>
          ) : (
            <p>还没有保存紫微摘要。请先完成评分。</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>抽牌结果</h2>
          {reading.cardDraw ? (
            <ul>
              <li>原始能量：{reading.cardDraw.rawEnergyScore}</li>
              <li>映射能量：{reading.cardDraw.mappedEnergyScore}</li>
              <li>抽牌详情已保存到 `card_draws.draw_json`。</li>
            </ul>
          ) : (
            <p>当前还没有绑定抽牌结果。</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>评分摘要</h2>
          {reading.fiveDimensionScore ? (
            <>
              <p>
                核心趋势：<strong>{breakdown?.focusTrend ?? "-"}</strong>
              </p>
              <p>
                主导因素：<strong>{reading.fiveDimensionScore.dominantFactor}</strong>
              </p>
              <p>
                风险标签：<strong>{((reading.fiveDimensionScore.riskFlagsJson as string[]) ?? []).join(", ") || "none"}</strong>
              </p>
              <div className="drawResultGrid">
                {themes.map(([key, value]) => (
                  <article className="card compactCard" key={key}>
                    <h3>{value.label}</h3>
                    <p>{value.trend}</p>
                    <strong>{value.score}</strong>
                    <p>结构 {value.structure} × 时运 {value.timing}</p>
                    <p>能量 {value.energy} | 心念 {value.mind} | 行动 {value.actionDisplay}</p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p>当前还没有评分结果，请先完成评分。</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>最新 AI 报告</h2>
          {latestReport ? (
            <>
              <p>
                版本：<strong>{latestReport.reportVersion}</strong>
              </p>
              <pre className="codeBlock reportBlock">{latestReport.reportText}</pre>
            </>
          ) : (
            <p>当前还没有 AI 报告。评分完成后，页面会自动生成。</p>
          )}
        </article>
      </section>
    </main>
  );
}
