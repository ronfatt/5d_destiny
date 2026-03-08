import { ReadingStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildRiskFlags, computeThemeScore, getDominantFactor } from "@/lib/five-dimension-engine";
import { generateZiweiChart, getThemeFromReading } from "@/lib/ziwei-engine";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ readingId: string }> }
) {
  try {
    const { readingId } = await params;

    const reading = await prisma.destinyReading.findUnique({
      where: { id: readingId },
      include: {
        fiveDimensionInput: true,
        questionnaireResult: true,
        cardDraw: true,
        birthProfile: true
      }
    });

    if (!reading) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }

    if (!reading.fiveDimensionInput || !reading.questionnaireResult || !reading.cardDraw) {
      return NextResponse.json(
        { error: "Reading requires questionnaire data and card draw before scoring." },
        { status: 400 }
      );
    }

    if (!reading.birthProfile) {
      return NextResponse.json({ error: "Reading is missing birth profile data." }, { status: 400 });
    }

    const birthProfile = reading.birthProfile;
    const ziweiChart = generateZiweiChart(birthProfile);
    const themeEntries = Object.values(ziweiChart.themes);

    const inputRecord = reading.fiveDimensionInput;
    const energy = inputRecord.energyValue;
    const mind = inputRecord.mindValue;
    const actionRaw = Math.round(inputRecord.actionValue);

    const breakdown = Object.fromEntries(
      themeEntries.map((config) => [config.key, computeThemeScore(config, energy, mind, actionRaw)])
    );

    const focusKey = getThemeFromReading(reading.theme);
    const focusBreakdown = breakdown[focusKey];
    const riskFlags = buildRiskFlags(energy, mind, actionRaw);
    const dominantFactor = getDominantFactor(focusBreakdown);

    const score = await prisma.$transaction(async (tx) => {
      const latestChart = await tx.ziweiChart.findFirst({
        where: {
          birthProfileId: birthProfile.id,
          engineVersion: ziweiChart.engineVersion,
          school: ziweiChart.school
        },
        orderBy: { createdAt: "desc" }
      });

      if (latestChart) {
        await tx.ziweiChart.update({
          where: { id: latestChart.id },
          data: { chartJson: ziweiChart }
        });
      } else {
        await tx.ziweiChart.create({
          data: {
            birthProfileId: birthProfile.id,
            engineVersion: ziweiChart.engineVersion,
            school: ziweiChart.school,
            chartJson: ziweiChart
          }
        });
      }

      await tx.fiveDimensionInput.update({
        where: { readingId },
        data: {
          structureValue: ziweiChart.themes[focusKey].structure,
          timingValue: ziweiChart.themes[focusKey].timing,
          inputJson: {
            ...(typeof inputRecord.inputJson === "object" && inputRecord.inputJson !== null
              ? (inputRecord.inputJson as Record<string, unknown>)
              : {}),
            ziweiChartSummary: {
              engineVersion: ziweiChart.engineVersion,
              school: ziweiChart.school,
              lifePalace: ziweiChart.lifePalace,
              bodyPalace: ziweiChart.bodyPalace,
              focusTheme: focusKey
            }
          }
        }
      });

      const saved = await tx.fiveDimensionScore.upsert({
        where: { readingId },
        update: {
          careerScore: breakdown.career.score,
          wealthScore: breakdown.wealth.score,
          loveScore: breakdown.love.score,
          healthScore: breakdown.health.score,
          dominantFactor,
          riskFlagsJson: riskFlags,
          breakdownJson: {
            source: "ziwei_preset_A",
            focusTheme: reading.theme,
            focusTrend: focusBreakdown.trend,
            themes: breakdown
          },
          engineVersion: "mvp-v0.1"
        },
        create: {
          readingId,
          careerScore: breakdown.career.score,
          wealthScore: breakdown.wealth.score,
          loveScore: breakdown.love.score,
          healthScore: breakdown.health.score,
          dominantFactor,
          riskFlagsJson: riskFlags,
          breakdownJson: {
            source: "ziwei_preset_A",
            focusTheme: reading.theme,
            focusTrend: focusBreakdown.trend,
            themes: breakdown
          },
          engineVersion: "mvp-v0.1"
        }
      });

      await tx.destinyReading.update({
        where: { id: readingId },
        data: {
          status: ReadingStatus.COMPLETED,
          completedAt: new Date()
        }
      });

      return saved;
    });

    return NextResponse.json({
      data: {
        readingId,
        focusTheme: reading.theme,
        dominantFactor,
        riskFlags,
        scores: {
          career: score.careerScore,
          wealth: score.wealthScore,
          love: score.loveScore,
          health: score.healthScore
        },
        trend: focusBreakdown.trend,
        breakdown
      }
    });
  } catch (error) {
    console.error("POST /api/readings/[readingId]/score failed", error);
    return NextResponse.json({ error: "Unable to score reading." }, { status: 500 });
  }
}
