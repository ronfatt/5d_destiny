import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportRunner } from "./ReportRunner";
import { ScoreRunner } from "./ScoreRunner";
import { ReadingMetaEditor } from "./ReadingMetaEditor";
import {
  dominantFactorMap,
  extractReportSections,
  getTimeWindow,
  palaceLabelMap,
  riskFlagMap,
  starLabelMap,
  themeLabelMap,
  toThemeKey,
  trendLabelMap
} from "@/lib/ai-reading-prompt";
import { getCardMeaningZh, getCardNameZh } from "@/lib/card-localization";

type ReadingPageProps = {
  params: Promise<{ readingId: string }>;
};

type ReportJsonShape = {
  sections?: Record<string, string>;
};

type ZiweiChartJson = {
  engineVersion?: string;
  school?: string;
  lifePalace?: { key?: string; label?: string };
  bodyPalace?: { key?: string; label?: string };
  palaces?: Array<{
    key: string;
    label: string;
    score: number;
    stars?: Array<{ key?: string; label?: string }>;
  }>;
  themes?: Record<
    string,
    {
      structure: number;
      timing: number;
      palaceBreakdown?: Array<{
        palaceKey: string;
        palaceLabel: string;
        weight: number;
        score: number;
      }>;
    }
  >;
};

function listFromSection(section?: string) {
  if (!section) return [] as string[];
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-") || /^\d+\./.test(line))
    .map((line) => line.replace(/^[-\d.\s]+/, "").trim())
    .filter(Boolean);
}

export default async function ReadingResultPage({ params }: ReadingPageProps) {
  const { readingId } = await params;

  const reading = await prisma.destinyReading.findUnique({
    where: { id: readingId },
    include: {
      birthProfile: true,
      questionnaireResult: true,
      fiveDimensionInput: true,
      fiveDimensionScore: true,
      cardDraw: {
        include: {
          archetypeCard: true,
          energyCard1: true,
          energyCard2: true,
          eventCard: true
        }
      },
      reports: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!reading) {
    notFound();
  }

  const latestChart = reading.birthProfileId
    ? await prisma.ziweiChart.findFirst({
        where: { birthProfileId: reading.birthProfileId },
        orderBy: { createdAt: "desc" }
      })
    : null;

  const latestReport = reading.reports[0] ?? null;
  const reportJson = (latestReport?.reportJson ?? {}) as ReportJsonShape;
  const reportSections = reportJson.sections ?? (latestReport ? extractReportSections(latestReport.reportText) : {});
  const chart = (latestChart?.chartJson ?? {}) as ZiweiChartJson;
  const breakdown = (reading.fiveDimensionScore?.breakdownJson ?? {}) as {
    focusTheme?: string;
    focusTrend?: string;
    themes?: Record<
      string,
      {
        label?: string;
        score?: number;
        trend?: string;
        structure?: number;
        timing?: number;
        energy?: number;
        mind?: number;
        actionDisplay?: number;
      }
    >;
  };
  const draw = (reading.cardDraw?.drawJson ?? {}) as {
    archetype?: { name?: string; value?: number; polarity?: string };
    energy1?: { name?: string; value?: number; polarity?: string };
    energy2?: { name?: string; value?: number; polarity?: string };
    event?: { name?: string; value?: number; polarity?: string };
    formula?: { rawEnergyScore?: number; mappedEnergyScore?: number };
  };

  const themeKey = toThemeKey(reading.theme);
  const focusTheme = breakdown.themes?.[themeKey];
  const title = reading.title?.trim() || reading.question;
  const conclusion = reportSections["命运结论"];
  const ziweiNarrative = reportSections["紫微命盘解释"];
  const cardNarrative = reportSections["命运卡解释"];
  const eventItems = listFromSection(reportSections["现实可能事件"]);
  const adviceItems = listFromSection(reportSections["行动建议"]);
  const basisItems = listFromSection(reportSections["解读依据"]);
  const riskText = reportSections["风险提醒"];
  const focusPalaces = chart.themes?.[themeKey]?.palaceBreakdown?.slice().sort((a, b) => b.weight - a.weight).slice(0, 3) ?? [];
  const drawCards = [
    {
      label: "命格原型",
      name: getCardNameZh(reading.cardDraw?.archetypeCard.cardKey ?? draw.archetype?.name ?? "", draw.archetype?.name),
      value: draw.archetype?.value,
      meaning: getCardMeaningZh(reading.cardDraw?.archetypeCard.cardKey ?? "", draw.archetype?.polarity, draw.archetype?.polarity === "negative" ? reading.cardDraw?.archetypeCard.shadowMeaning : reading.cardDraw?.archetypeCard.positiveMeaning)
    },
    {
      label: "当前能量",
      name: getCardNameZh(reading.cardDraw?.energyCard1.cardKey ?? draw.energy1?.name ?? "", draw.energy1?.name),
      value: draw.energy1?.value,
      meaning: getCardMeaningZh(reading.cardDraw?.energyCard1.cardKey ?? "", draw.energy1?.polarity, draw.energy1?.polarity === "negative" ? reading.cardDraw?.energyCard1.shadowMeaning : reading.cardDraw?.energyCard1.positiveMeaning)
    },
    {
      label: "隐藏阻力",
      name: getCardNameZh(reading.cardDraw?.energyCard2.cardKey ?? draw.energy2?.name ?? "", draw.energy2?.name),
      value: draw.energy2?.value,
      meaning: getCardMeaningZh(reading.cardDraw?.energyCard2.cardKey ?? "", draw.energy2?.polarity, draw.energy2?.polarity === "negative" ? reading.cardDraw?.energyCard2.shadowMeaning : reading.cardDraw?.energyCard2.positiveMeaning)
    },
    {
      label: "现实事件",
      name: getCardNameZh(reading.cardDraw?.eventCard.cardKey ?? draw.event?.name ?? "", draw.event?.name),
      value: draw.event?.value,
      meaning: getCardMeaningZh(reading.cardDraw?.eventCard.cardKey ?? "", draw.event?.polarity, draw.event?.polarity === "negative" ? reading.cardDraw?.eventCard.shadowMeaning : reading.cardDraw?.eventCard.positiveMeaning)
    }
  ];

  return (
    <main>
      <section className="hero heroCompact readingHero">
        <div className="eyebrow">读取结果</div>
        <h1>{title}</h1>
        <p className="heroSummary">
          {conclusion || "系统正在把命盘结构、命运卡和当前时运整合为一份完整解盘。评分完成后会自动生成命运叙事。"}
        </p>
        <div className="basisStrip">
          本次解读基于：紫微斗数命盘结构、命运卡能量抽取、五维评分模型、AI综合推演。
        </div>
        <div className="readingHeroMeta">
          <div className="focusPill">{themeLabelMap[themeKey]}主题</div>
          <div className="focusPill">{trendLabelMap[focusTheme?.trend ?? ""] ?? focusTheme?.trend ?? "待推演"}</div>
          <div className="focusPill">{getTimeWindow(focusTheme?.timing ?? 1, focusTheme?.trend)}</div>
        </div>
      </section>

      <section className="grid reportGrid">
        <article className="card storyCard" style={{ gridColumn: "span 12" }}>
          <h2>命运结论</h2>
          <p>{conclusion || "当前还没有生成完整结论。页面会在评分后自动生成。"}</p>
        </article>

        <article className="card storyCard" style={{ gridColumn: "span 7" }}>
          <h2>紫微命盘解释</h2>
          <p>{ziweiNarrative || "命盘解释将在 AI 解盘完成后显示。"}</p>
          <div className="drawResultGrid insightGrid">
            <article className="card compactCard">
              <h3>命宫</h3>
              <strong>{palaceLabelMap[chart.lifePalace?.key ?? ""] ?? chart.lifePalace?.label ?? "-"}</strong>
            </article>
            <article className="card compactCard">
              <h3>身宫</h3>
              <strong>{palaceLabelMap[chart.bodyPalace?.key ?? ""] ?? chart.bodyPalace?.label ?? "-"}</strong>
            </article>
            <article className="card compactCard">
              <h3>当前时运窗口</h3>
              <strong>{getTimeWindow(focusTheme?.timing ?? 1, focusTheme?.trend)}</strong>
            </article>
          </div>
          {focusPalaces.length ? (
            <div className="stackList">
              {focusPalaces.map((item) => {
                const palaceKey = item.palaceKey === "body" ? chart.bodyPalace?.key ?? "" : item.palaceKey;
                const palace = chart.palaces?.find((entry) => entry.key === palaceKey);
                const starNames =
                  palace?.stars?.map((star) => starLabelMap[star.key ?? ""] ?? star.label ?? star.key ?? "未知") ?? [];

                return (
                  <div className="stackItem" key={`${item.palaceKey}-${item.weight}`}>
                    <strong>
                      {item.palaceKey === "body"
                        ? `身宫（${palaceLabelMap[chart.bodyPalace?.key ?? ""] ?? chart.bodyPalace?.label ?? "未知"}）`
                        : palaceLabelMap[item.palaceKey] ?? item.palaceLabel}
                    </strong>
                    <span>
                      权重 {Math.round(item.weight * 100)}% · 宫位分 {item.score}
                      {starNames.length ? ` · 主星 ${starNames.join("、")}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </article>

        <article className="card storyCard" style={{ gridColumn: "span 5" }}>
          <h2>命运卡解释</h2>
          <p>{cardNarrative || "抽牌故事将在 AI 解盘完成后显示。"}</p>
          <div className="stackList">
            {drawCards.map((card) => (
              <div className="stackItem" key={card.label}>
                <strong>
                  {card.label}：{card.name ?? "-"}
                </strong>
                <span>
                  {typeof card.value === "number" ? `数值 ${card.value}` : "未记录数值"}
                  {card.meaning ? ` · ${card.meaning}` : ""}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="card storyCard" style={{ gridColumn: "span 7" }}>
          <h2>现实可能事件</h2>
          {eventItems.length ? (
            <ul className="narrativeList">
              {eventItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>现实层面的事件预测将在 AI 解盘完成后显示。</p>
          )}
        </article>

        <article className="card storyCard" style={{ gridColumn: "span 5" }}>
          <h2>风险提醒</h2>
          <p>{riskText || "风险提醒将在 AI 解盘完成后显示。"}</p>
          {reading.fiveDimensionScore ? (
            <div className="stackList compactStack">
              <div className="stackItem">
                <strong>主导因素</strong>
                <span>{dominantFactorMap[reading.fiveDimensionScore.dominantFactor] ?? reading.fiveDimensionScore.dominantFactor}</span>
              </div>
              <div className="stackItem">
                <strong>风险标签</strong>
                <span>
                  {((reading.fiveDimensionScore.riskFlagsJson as string[]) ?? [])
                    .map((flag) => riskFlagMap[flag] ?? flag)
                    .join("、") || "当前无明显风险标签"}
                </span>
              </div>
            </div>
          ) : null}
        </article>

        <article className="card storyCard" style={{ gridColumn: "span 12" }}>
          <h2>行动建议</h2>
          {adviceItems.length ? (
            <ol className="narrativeList orderedList">
              {adviceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : (
            <p>行动建议将在 AI 解盘完成后显示。</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>读取备注</h2>
          <ReadingMetaEditor readingId={reading.id} initialTitle={reading.title ?? ""} initialNote={reading.note ?? ""} />
          <ScoreRunner readingId={reading.id} hasScore={Boolean(reading.fiveDimensionScore)} />
          {reading.fiveDimensionScore ? <ReportRunner readingId={reading.id} hasReport={Boolean(latestReport)} /> : null}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <details className="techDetails">
            <summary>技术数据</summary>
            <div className="grid techGrid">
              <article className="card" style={{ gridColumn: "span 4" }}>
                <h3>输入快照</h3>
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
                <h3>五维输入</h3>
                <ul>
                  <li>结构：{reading.fiveDimensionInput?.structureValue ?? "-"}</li>
                  <li>时运：{reading.fiveDimensionInput?.timingValue ?? "-"}</li>
                  <li>能量：{reading.fiveDimensionInput?.energyValue ?? "-"}</li>
                  <li>心念：{reading.fiveDimensionInput?.mindValue ?? "-"}</li>
                  <li>行动：{reading.fiveDimensionInput?.actionValue ?? "-"}</li>
                </ul>
              </article>

              <article className="card" style={{ gridColumn: "span 4" }}>
                <h3>问卷</h3>
                <ul>
                  <li>心念平均分：{reading.questionnaireResult?.mindAverage ?? "-"}</li>
                  <li>心念系数：{reading.questionnaireResult?.mindFactor ?? "-"}</li>
                  <li>行动总分：{reading.questionnaireResult?.actionTotal ?? "-"}</li>
                  <li>行动原始值：{reading.questionnaireResult?.actionRaw ?? "-"}</li>
                  <li>行动标签：{reading.questionnaireResult?.actionLabel ?? "-"}</li>
                </ul>
              </article>

              <article className="card" style={{ gridColumn: "span 6" }}>
                <h3>紫微摘要</h3>
                <ul>
                  <li>引擎：{chart.engineVersion ?? "-"}</li>
                  <li>流派：{chart.school ?? "-"}</li>
                  <li>命宫：{palaceLabelMap[chart.lifePalace?.key ?? ""] ?? chart.lifePalace?.label ?? "-"}</li>
                  <li>身宫：{palaceLabelMap[chart.bodyPalace?.key ?? ""] ?? chart.bodyPalace?.label ?? "-"}</li>
                </ul>
              </article>

              <article className="card" style={{ gridColumn: "span 6" }}>
                <h3>抽牌结果</h3>
                <ul>
                  <li>原始能量：{draw.formula?.rawEnergyScore ?? "-"}</li>
                  <li>映射能量：{draw.formula?.mappedEnergyScore ?? "-"}</li>
                  <li>命格原型：{draw.archetype?.name ?? "-"}</li>
                  <li>事件牌：{draw.event?.name ?? "-"}</li>
                </ul>
              </article>

              <article className="card" style={{ gridColumn: "span 12" }}>
                <h3>评分摘要</h3>
                {reading.fiveDimensionScore ? (
                  <div className="drawResultGrid">
                    {Object.entries(breakdown.themes ?? {}).map(([key, value]) => (
                      <article className="card compactCard" key={key}>
                        <h3>{themeLabelMap[key as keyof typeof themeLabelMap] ?? value.label ?? key}</h3>
                        <p>{trendLabelMap[value.trend ?? ""] ?? value.trend}</p>
                        <strong>{value.score}</strong>
                        <p>结构 {value.structure} × 时运 {value.timing}</p>
                        <p>能量 {value.energy} | 心念 {value.mind} | 行动 {value.actionDisplay}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p>当前还没有评分结果。</p>
                )}
              </article>

              <article className="card" style={{ gridColumn: "span 12" }}>
                <h3>原始 AI 文本</h3>
                {latestReport ? <pre className="codeBlock reportBlock">{latestReport.reportText}</pre> : <p>当前还没有 AI 报告。</p>}
              </article>
            </div>
          </details>
        </article>

        {basisItems.length ? (
          <article className="card" style={{ gridColumn: "span 12" }}>
            <h2>为什么这次解读成立</h2>
            <ul className="narrativeList">
              {basisItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ) : null}
      </section>
    </main>
  );
}
