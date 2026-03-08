import { ReadingTheme, ReadingType, UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedThemes = new Set<ReadingTheme>(["CAREER", "WEALTH", "LOVE", "HEALTH"]);

function round(value: number, precision = 2) {
  return Number(value.toFixed(precision));
}

function getMindLevel(average: number) {
  if (average < 2) return { level: 1, factor: 0.82, label: "fear" };
  if (average < 3) return { level: 2, factor: 0.88, label: "anxiety" };
  if (average < 4) return { level: 3, factor: 0.94, label: "instability" };
  if (average < 5) return { level: 4, factor: 1.0, label: "stability" };
  if (average < 5.5) return { level: 5, factor: 1.06, label: "creation" };
  if (average < 6.3) return { level: 6, factor: 1.12, label: "leadership" };
  return { level: 7, factor: 1.18, label: "mission" };
}

function getActionScore(total: number) {
  if (total <= 0) return { raw: 0, label: "inactive" };
  if (total <= 2) return { raw: 20, label: "hesitant" };
  if (total <= 4) return { raw: 35, label: "inconsistent" };
  if (total <= 6) return { raw: 55, label: "baseline" };
  if (total <= 8) return { raw: 75, label: "consistent" };
  return { raw: 90, label: "high_execution" };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      birthProfileId?: string;
      question?: string;
      theme?: ReadingTheme;
      mindAnswers?: number[];
      actionAnswers?: number[];
    };

    const birthProfileId = body.birthProfileId?.trim();
    const question = body.question?.trim();
    const theme = body.theme && allowedThemes.has(body.theme) ? body.theme : null;
    const mindAnswers = Array.isArray(body.mindAnswers) ? body.mindAnswers.map(Number) : [];
    const actionAnswers = Array.isArray(body.actionAnswers) ? body.actionAnswers.map(Number) : [];

    if (!birthProfileId) {
      return NextResponse.json({ error: "Birth profile id is required." }, { status: 400 });
    }

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    if (!theme) {
      return NextResponse.json({ error: "Theme is required." }, { status: 400 });
    }

    if (mindAnswers.length !== 10 || mindAnswers.some((value) => !Number.isFinite(value) || value < 1 || value > 7)) {
      return NextResponse.json({ error: "Mind answers must contain 10 values from 1 to 7." }, { status: 400 });
    }

    if (actionAnswers.length !== 5 || actionAnswers.some((value) => !Number.isFinite(value) || value < 0 || value > 2)) {
      return NextResponse.json({ error: "Action answers must contain 5 values from 0 to 2." }, { status: 400 });
    }

    const birthProfile = await prisma.birthProfile.findUnique({
      where: { id: birthProfileId },
      select: { id: true, userId: true }
    });

    if (!birthProfile) {
      return NextResponse.json({ error: "Birth profile not found." }, { status: 404 });
    }

    const mindAverage = round(mindAnswers.reduce((sum, value) => sum + value, 0) / mindAnswers.length, 2);
    const mind = getMindLevel(mindAverage);
    const actionTotal = actionAnswers.reduce((sum, value) => sum + value, 0);
    const action = getActionScore(actionTotal);

    const created = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: birthProfile.userId },
        data: { status: UserStatus.ACTIVE }
      });

      const reading = await tx.destinyReading.create({
        data: {
          userId: birthProfile.userId,
          birthProfileId: birthProfile.id,
          question,
          theme,
          readingType: ReadingType.STANDARD
        }
      });

      await tx.questionnaireResult.create({
        data: {
          readingId: reading.id,
          mindAnswersJson: mindAnswers,
          mindAverage,
          mindLevel: mind.level,
          mindFactor: mind.factor,
          actionAnswersJson: actionAnswers,
          actionTotal,
          actionRaw: action.raw,
          actionLabel: action.label
        }
      });

      await tx.fiveDimensionInput.create({
        data: {
          readingId: reading.id,
          structureValue: 0,
          timingValue: 1,
          energyValue: 0,
          mindValue: mind.factor,
          actionValue: action.raw,
          inputJson: {
            source: "questionnaire_mvp",
            mindAverage,
            mindLevel: mind.level,
            mindLabel: mind.label,
            actionTotal,
            actionLabel: action.label
          }
        }
      });

      return reading;
    });

    return NextResponse.json(
      {
        data: {
          readingId: created.id,
          theme: created.theme,
          question: created.question,
          mindAverage,
          mindFactor: mind.factor,
          actionTotal,
          actionRaw: action.raw
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/questionnaires failed", error);
    return NextResponse.json({ error: "Unable to save questionnaire." }, { status: 500 });
  }
}
