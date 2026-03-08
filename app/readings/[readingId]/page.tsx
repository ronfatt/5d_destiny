import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportRunner } from "./ReportRunner";
import { ScoreRunner } from "./ScoreRunner";

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

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Reading Result</div>
        <h1>Reading {reading.id}</h1>
        <p>
          This page combines the birth profile, questionnaire, card draw, scoring output, the latest saved AI
          report, and a persisted Ziwei chart summary. Structure and timing now come from the preset_A Ziwei engine.
        </p>
        <ScoreRunner readingId={reading.id} hasScore={Boolean(reading.fiveDimensionScore)} />
        {reading.fiveDimensionScore ? <ReportRunner readingId={reading.id} /> : null}
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>Input Snapshot</h2>
          <ul>
            <li>Theme: {reading.theme}</li>
            <li>Status: {reading.status}</li>
            <li>Question: {reading.question}</li>
            <li>Birth city: {reading.birthProfile?.birthLocation ?? "-"}</li>
            <li>Timezone: {reading.birthProfile?.timezone ?? "-"}</li>
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>Five-Dimension Inputs</h2>
          <ul>
            <li>Structure: {reading.fiveDimensionInput?.structureValue ?? "-"}</li>
            <li>Timing: {reading.fiveDimensionInput?.timingValue ?? "-"}</li>
            <li>Energy: {reading.fiveDimensionInput?.energyValue ?? "-"}</li>
            <li>Mind: {reading.fiveDimensionInput?.mindValue ?? "-"}</li>
            <li>Action: {reading.fiveDimensionInput?.actionValue ?? "-"}</li>
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>Questionnaire</h2>
          <ul>
            <li>Mind average: {reading.questionnaireResult?.mindAverage ?? "-"}</li>
            <li>Mind factor: {reading.questionnaireResult?.mindFactor ?? "-"}</li>
            <li>Action total: {reading.questionnaireResult?.actionTotal ?? "-"}</li>
            <li>Action raw: {reading.questionnaireResult?.actionRaw ?? "-"}</li>
            <li>Action label: {reading.questionnaireResult?.actionLabel ?? "-"}</li>
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Ziwei Summary</h2>
          {ziweiSummary ? (
            <ul>
              <li>Engine: {ziweiSummary.engineVersion ?? "-"}</li>
              <li>School: {ziweiSummary.school ?? "-"}</li>
              <li>Life palace: {ziweiSummary.lifePalace?.label ?? "-"}</li>
              <li>Body palace: {ziweiSummary.bodyPalace?.label ?? "-"}</li>
              <li>Focus theme source: {ziweiSummary.focusTheme ?? "-"}</li>
            </ul>
          ) : (
            <p>No Ziwei chart summary has been saved yet. Compute the score first.</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Card Draw</h2>
          {reading.cardDraw ? (
            <ul>
              <li>Raw energy: {reading.cardDraw.rawEnergyScore}</li>
              <li>Mapped energy: {reading.cardDraw.mappedEnergyScore}</li>
              <li>Draw payload saved in `card_draws.draw_json`.</li>
            </ul>
          ) : (
            <p>No card draw attached yet.</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Score Summary</h2>
          {reading.fiveDimensionScore ? (
            <>
              <p>
                Focus trend: <strong>{breakdown?.focusTrend ?? "-"}</strong>
              </p>
              <p>
                Dominant factor: <strong>{reading.fiveDimensionScore.dominantFactor}</strong>
              </p>
              <p>
                Risk flags: <strong>{((reading.fiveDimensionScore.riskFlagsJson as string[]) ?? []).join(", ") || "none"}</strong>
              </p>
              <div className="drawResultGrid">
                {themes.map(([key, value]) => (
                  <article className="card compactCard" key={key}>
                    <h3>{value.label}</h3>
                    <p>{value.trend}</p>
                    <strong>{value.score}</strong>
                    <p>Structure {value.structure} x Timing {value.timing}</p>
                    <p>Energy {value.energy} | Mind {value.mind} | Action {value.actionDisplay}</p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p>No score has been computed yet. Run the scoring step first.</p>
          )}
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Latest AI Report</h2>
          {latestReport ? (
            <>
              <p>
                Version: <strong>{latestReport.reportVersion}</strong>
              </p>
              <pre className="codeBlock reportBlock">{latestReport.reportText}</pre>
            </>
          ) : (
            <p>No AI report has been saved yet. Generate one after scoring.</p>
          )}
        </article>
      </section>
    </main>
  );
}
