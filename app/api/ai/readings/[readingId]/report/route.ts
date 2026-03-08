import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAIClient, hasOpenAIKey } from "@/lib/openai";

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
        cardDraw: true,
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

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are an analyst for a Five-Dimension Destiny System. Explain only from provided data. Do not invent Ziwei placements or cards. Keep the report concise, structured, and practical."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(
                {
                  reading: {
                    id: reading.id,
                    theme: reading.theme,
                    question: reading.question,
                    status: reading.status
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
                  fiveDimensionInput: reading.fiveDimensionInput,
                  cardDraw: reading.cardDraw.drawJson,
                  score: {
                    career: reading.fiveDimensionScore.careerScore,
                    wealth: reading.fiveDimensionScore.wealthScore,
                    love: reading.fiveDimensionScore.loveScore,
                    health: reading.fiveDimensionScore.healthScore,
                    dominantFactor: reading.fiveDimensionScore.dominantFactor,
                    riskFlags: reading.fiveDimensionScore.riskFlagsJson,
                    breakdown: reading.fiveDimensionScore.breakdownJson
                  },
                  outputFormat: {
                    sections: [
                      "Overall trend",
                      "Five-dimension interpretation",
                      "Card energy meaning",
                      "Risk reminder",
                      "Action advice"
                    ]
                  }
                },
                null,
                2
              )
            }
          ]
        }
      ]
    });

    return NextResponse.json({
      data: {
        readingId,
        reportText: response.output_text
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
