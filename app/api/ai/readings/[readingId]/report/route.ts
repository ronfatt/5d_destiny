import { ReportType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAIClient, hasOpenAIKey } from "@/lib/openai";
import {
  buildReadingNarrativePrompts,
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

type ZiweiChartJson = {
  engineVersion?: string;
  school?: string;
  lifePalace?: { key?: string; label?: string };
  bodyPalace?: { key?: string; label?: string };
  palaces?: Array<{
    key: string;
    label: string;
    stars?: Array<{ key?: string; label?: string }>;
    score: number;
  }>;
  themes?: Record<
    string,
    {
      palaceBreakdown?: Array<{
        palaceKey: string;
        palaceLabel: string;
        weight: number;
        score: number;
      }>;
    }
  >;
};

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ readingId: string }> }
) {
  try {
    const { readingId } = await params;

    if (!hasOpenAIKey()) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const reading = await prisma.destinyReading.findUnique({
      where: { id: readingId },
      include: {
        birthProfile: true,
        questionnaireResult: true,
        cardDraw: {
          include: {
            archetypeCard: true,
            energyCard1: true,
            energyCard2: true,
            eventCard: true
          }
        },
        fiveDimensionInput: true,
        fiveDimensionScore: true
      }
    });

    if (!reading || !reading.fiveDimensionScore || !reading.cardDraw || !reading.questionnaireResult) {
      return NextResponse.json(
        { error: "Reading must have questionnaire, card draw, and score data before AI report generation." },
        { status: 400 }
      );
    }

    const latestChart = reading.birthProfileId
      ? await prisma.ziweiChart.findFirst({
          where: { birthProfileId: reading.birthProfileId },
          orderBy: { createdAt: "desc" }
        })
      : null;

    const chart = (latestChart?.chartJson ?? {}) as ZiweiChartJson;
    const breakdown = (reading.fiveDimensionScore.breakdownJson ?? {}) as {
      focusTheme?: string;
      focusTrend?: string;
      themes?: Record<
        string,
        {
          label?: string;
          trend?: string;
          score?: number;
          structure?: number;
          timing?: number;
          energy?: number;
          mind?: number;
          actionDisplay?: number;
        }
      >;
    };

    const themeKey = toThemeKey(reading.theme);
    const focusTheme = breakdown.themes?.[themeKey] ?? {};
    const draw = (reading.cardDraw.drawJson ?? {}) as {
      archetype?: { name?: string; value?: number; polarity?: string };
      energy1?: { name?: string; value?: number; polarity?: string };
      energy2?: { name?: string; value?: number; polarity?: string };
      event?: { name?: string; value?: number; polarity?: string };
      formula?: { mappedEnergyScore?: number };
    };

    const palaceBreakdown = chart.themes?.[themeKey]?.palaceBreakdown ?? [];
    const focusPalaces = palaceBreakdown
      .slice()
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((item) => {
        const palaceKey = item.palaceKey === "body" ? chart.bodyPalace?.key ?? "body" : item.palaceKey;
        const palace = chart.palaces?.find((entry) => entry.key === palaceKey);

        return {
          palaceLabel:
            item.palaceKey === "body"
              ? `身宫（${palaceLabelMap[chart.bodyPalace?.key ?? ""] ?? chart.bodyPalace?.label ?? "未知"}）`
              : palaceLabelMap[item.palaceKey] ?? item.palaceLabel,
          weight: item.weight,
          score: item.score,
          stars:
            palace?.stars?.map((star) => starLabelMap[star.key ?? ""] ?? star.label ?? star.key ?? "未知") ?? []
        };
      });

    const reportPayload = {
      reading: {
        id: reading.id,
        theme: reading.theme,
        title: reading.title,
        question: reading.question,
        note: reading.note
      },
      birthProfile: {
        birthLocation: reading.birthProfile?.birthLocation,
        timezone: reading.birthProfile?.timezone,
        gender: reading.birthProfile?.gender
      },
      questionnaire: {
        mindAverage: reading.questionnaireResult.mindAverage,
        mindFactor: reading.questionnaireResult.mindFactor,
        actionTotal: reading.questionnaireResult.actionTotal,
        actionRaw: reading.questionnaireResult.actionRaw,
        actionLabel: reading.questionnaireResult.actionLabel
      },
      focusTheme: {
        key: themeKey,
        label: themeLabelMap[themeKey],
        trend: trendLabelMap[focusTheme.trend ?? ""] ?? focusTheme.trend,
        score: focusTheme.score,
        structure: focusTheme.structure,
        timing: focusTheme.timing,
        energy: focusTheme.energy,
        mind: focusTheme.mind,
        actionDisplay: focusTheme.actionDisplay,
        predictionWindow: getTimeWindow(focusTheme.timing ?? 1, focusTheme.trend)
      },
      dominantFactor: dominantFactorMap[reading.fiveDimensionScore.dominantFactor] ?? reading.fiveDimensionScore.dominantFactor,
      riskFlags: ((reading.fiveDimensionScore.riskFlagsJson as string[]) ?? []).map(
        (flag) => riskFlagMap[flag] ?? flag
      ),
      ziwei: {
        engineVersion: chart.engineVersion,
        school: chart.school,
        lifePalace: {
          key: chart.lifePalace?.key,
          label: palaceLabelMap[chart.lifePalace?.key ?? ""] ?? chart.lifePalace?.label
        },
        bodyPalace: {
          key: chart.bodyPalace?.key,
          label: palaceLabelMap[chart.bodyPalace?.key ?? ""] ?? chart.bodyPalace?.label
        },
        focusPalaces
      },
      cards: {
        archetype: {
          name: getCardNameZh(reading.cardDraw.archetypeCard.cardKey, draw.archetype?.name),
          value: draw.archetype?.value,
          polarity: draw.archetype?.polarity,
          meaning: getCardMeaningZh(reading.cardDraw.archetypeCard.cardKey, draw.archetype?.polarity, draw.archetype?.polarity === "negative" ? reading.cardDraw.archetypeCard.shadowMeaning : reading.cardDraw.archetypeCard.positiveMeaning)
        },
        energy1: {
          name: getCardNameZh(reading.cardDraw.energyCard1.cardKey, draw.energy1?.name),
          value: draw.energy1?.value,
          polarity: draw.energy1?.polarity,
          meaning: getCardMeaningZh(reading.cardDraw.energyCard1.cardKey, draw.energy1?.polarity, draw.energy1?.polarity === "negative" ? reading.cardDraw.energyCard1.shadowMeaning : reading.cardDraw.energyCard1.positiveMeaning)
        },
        energy2: {
          name: getCardNameZh(reading.cardDraw.energyCard2.cardKey, draw.energy2?.name),
          value: draw.energy2?.value,
          polarity: draw.energy2?.polarity,
          meaning: getCardMeaningZh(reading.cardDraw.energyCard2.cardKey, draw.energy2?.polarity, draw.energy2?.polarity === "negative" ? reading.cardDraw.energyCard2.shadowMeaning : reading.cardDraw.energyCard2.positiveMeaning)
        },
        event: {
          name: getCardNameZh(reading.cardDraw.eventCard.cardKey, draw.event?.name),
          value: draw.event?.value,
          polarity: draw.event?.polarity,
          meaning: getCardMeaningZh(reading.cardDraw.eventCard.cardKey, draw.event?.polarity, draw.event?.polarity === "negative" ? reading.cardDraw.eventCard.shadowMeaning : reading.cardDraw.eventCard.positiveMeaning)
        },
        mappedEnergyScore: reading.cardDraw.mappedEnergyScore
      }
    };

    const { systemPrompt, userPrompt } = buildReadingNarrativePrompts(reportPayload);
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }]
        }
      ]
    });

    const reportText = response.output_text.trim();
    const sections = extractReportSections(reportText);

    const savedReport = await prisma.destinyReport.create({
      data: {
        readingId,
        reportType: ReportType.FULL,
        reportVersion: "ai-report-v2-narrative",
        reportJson: {
          source: "openai",
          model: "gpt-4.1-mini",
          generatedAt: new Date().toISOString(),
          sections,
          payload: reportPayload
        },
        reportText
      }
    });

    return NextResponse.json({
      data: {
        readingId,
        reportId: savedReport.id,
        reportText,
        sections
      }
    });
  } catch (error) {
    console.error("POST /api/ai/readings/[readingId]/report failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate AI report." },
      { status: 500 }
    );
  }
}
