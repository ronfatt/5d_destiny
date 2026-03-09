import { CardCategory, CardValueMode, ReadingStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clamp, destinyCardSeeds, resolveCardValue, round } from "@/lib/destiny-cards";
import { getCardNameZh } from "@/lib/card-localization";

function pickOne<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { readingId?: string };
    const readingId = body.readingId?.trim();

    if (!readingId) {
      return NextResponse.json({ error: "Reading id is required." }, { status: 400 });
    }

    const reading = await prisma.destinyReading.findUnique({
      where: { id: readingId },
      include: {
        fiveDimensionInput: true
      }
    });

    if (!reading) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }

    if (!reading.fiveDimensionInput) {
      return NextResponse.json({ error: "Reading is missing five-dimension input data." }, { status: 400 });
    }

    const existingInput = reading.fiveDimensionInput;

    const result = await prisma.$transaction(async (tx) => {
      await tx.destinyCard.createMany({
        data: destinyCardSeeds.map((card) => ({
          cardKey: card.cardKey,
          name: card.name,
          category: card.category as CardCategory,
          valueMode: card.valueMode as CardValueMode,
          baseValue: card.baseValue,
          positiveValue: card.positiveValue,
          negativeValue: card.negativeValue,
          keywordsJson: card.keywords,
          positiveMeaning: card.positiveMeaning,
          shadowMeaning: card.shadowMeaning,
          interpretationHint: card.interpretationHint,
          themeBiasJson: card.themeBias ?? undefined
        })),
        skipDuplicates: true
      });

      const cards = await tx.destinyCard.findMany({
        where: {
          cardKey: {
            in: destinyCardSeeds.map((card) => card.cardKey)
          }
        }
      });

      const archetypes = cards.filter((card) => card.category === CardCategory.ARCHETYPE);
      const energies = cards.filter((card) => card.category === CardCategory.ENERGY);
      const events = cards.filter((card) => card.category === CardCategory.EVENT);

      const archetype = pickOne(archetypes);
      const energyOne = pickOne(energies);
      const energyTwoPool = energies.filter((card) => card.id !== energyOne.id);
      const energyTwo = pickOne(energyTwoPool);
      const eventCard = pickOne(events);

      const archetypeSeed = destinyCardSeeds.find((card) => card.cardKey === archetype.cardKey)!;
      const energyOneSeed = destinyCardSeeds.find((card) => card.cardKey === energyOne.cardKey)!;
      const energyTwoSeed = destinyCardSeeds.find((card) => card.cardKey === energyTwo.cardKey)!;
      const eventSeed = destinyCardSeeds.find((card) => card.cardKey === eventCard.cardKey)!;

      const resolvedArchetype = resolveCardValue(archetypeSeed);
      const resolvedEnergyOne = resolveCardValue(energyOneSeed);
      const resolvedEnergyTwo = resolveCardValue(energyTwoSeed);
      const resolvedEvent = resolveCardValue(eventSeed);

      const rawEnergyScore = round(
        resolvedArchetype.value * 0.3 +
          resolvedEnergyOne.value * 0.25 +
          resolvedEnergyTwo.value * 0.25 +
          resolvedEvent.value * 0.2,
        2
      );
      const mappedEnergyScore = clamp(round(rawEnergyScore * 3, 1), -20, 20);

      const drawJson = {
        archetype: { key: archetype.cardKey, name: getCardNameZh(archetype.cardKey, archetype.name), value: resolvedArchetype.value, polarity: resolvedArchetype.polarity },
        energy1: { key: energyOne.cardKey, name: getCardNameZh(energyOne.cardKey, energyOne.name), value: resolvedEnergyOne.value, polarity: resolvedEnergyOne.polarity },
        energy2: { key: energyTwo.cardKey, name: getCardNameZh(energyTwo.cardKey, energyTwo.name), value: resolvedEnergyTwo.value, polarity: resolvedEnergyTwo.polarity },
        event: { key: eventCard.cardKey, name: getCardNameZh(eventCard.cardKey, eventCard.name), value: resolvedEvent.value, polarity: resolvedEvent.polarity },
        formula: {
          archetypeWeight: 0.3,
          energy1Weight: 0.25,
          energy2Weight: 0.25,
          eventWeight: 0.2,
          rawEnergyScore,
          mappedEnergyScore
        }
      };

      const cardDraw = await tx.cardDraw.upsert({
        where: { readingId },
        update: {
          archetypeCardId: archetype.id,
          energyCard1Id: energyOne.id,
          energyCard2Id: energyTwo.id,
          eventCardId: eventCard.id,
          rawEnergyScore,
          mappedEnergyScore,
          drawJson
        },
        create: {
          readingId,
          archetypeCardId: archetype.id,
          energyCard1Id: energyOne.id,
          energyCard2Id: energyTwo.id,
          eventCardId: eventCard.id,
          rawEnergyScore,
          mappedEnergyScore,
          drawJson
        }
      });

      await tx.fiveDimensionInput.update({
        where: { readingId },
        data: {
          energyValue: mappedEnergyScore,
          inputJson: {
            ...(typeof existingInput.inputJson === "object" && existingInput.inputJson !== null
              ? (existingInput.inputJson as Record<string, unknown>)
              : {}),
            cardDraw: drawJson
          }
        }
      });

      await tx.destinyReading.update({
        where: { id: readingId },
        data: { status: ReadingStatus.PROCESSING }
      });

      return { cardDraw, drawJson, rawEnergyScore, mappedEnergyScore };
    });

    return NextResponse.json({
      data: {
        readingId,
        rawEnergyScore: result.rawEnergyScore,
        mappedEnergyScore: result.mappedEnergyScore,
        draw: result.drawJson
      }
    });
  } catch (error) {
    console.error("POST /api/card-draws failed", error);
    return NextResponse.json({ error: "Unable to draw cards." }, { status: 500 });
  }
}
