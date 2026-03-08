import { ReadingStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildRiskFlags,
  computeThemeScore,
  getDominantFactor,
  getThemeConfig,
  themeConfigs
} from "@/lib/five-dimension-engine";

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

    const energy = reading.fiveDimensionInput.energyValue;
    const mind = reading.fiveDimensionInput.mindValue;
    const actionRaw = Math.round(reading.fiveDimensionInput.actionValue);

    const breakdown = Object.fromEntries(
      themeConfigs.map((config) => [config.key, computeThemeScore(config, energy, mind, actionRaw)])
    );

    const focusConfig = getThemeConfig(reading.theme);
    const focusBreakdown = breakdown[focusConfig.key];
    const riskFlags = buildRiskFlags(energy, mind, actionRaw);
    const dominantFactor = getDominantFactor(focusBreakdown);

    const score = await prisma.$transaction(async (tx) => {
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
            source: "mvp_placeholder_structure_timing",
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
            source: "mvp_placeholder_structure_timing",
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
