import { destinyCardSeeds } from "@/lib/destiny-cards";

const styleBase = [
  "mystical cosmic tarot card",
  "eastern mythology style",
  "golden lines",
  "deep blue space background",
  "sacred geometry",
  "ultra detailed",
  "cinematic lighting",
  "ornate frame",
  "celestial symbols",
  "symmetrical composition",
  "cosmic dust particles",
  "imperial mystical costume",
  "no text"
].join(", ");

const negativePrompt = [
  "cartoon",
  "anime face",
  "low detail",
  "blurry",
  "modern city casual style",
  "cheap fantasy card art",
  "western medieval church aesthetic",
  "watermark",
  "text overlay"
].join(", ");

export function buildCardImagePrompt(cardKey: string) {
  const card = destinyCardSeeds.find((item) => item.cardKey === cardKey);

  if (!card) {
    throw new Error(`Unknown card key: ${cardKey}`);
  }

  const categoryRule =
    card.category === "ARCHETYPE"
      ? "Character-centered composition, mythic authority, celestial throne, gate, weapon, or formation behind the figure."
      : card.category === "ENERGY"
        ? "State-centered composition, abstract atmosphere, movement, light structure, no need for a single hero figure."
        : "Event-centered composition, visible action, clear narrative trigger in the scene.";

  const polarityRule =
    card.valueMode === "DUAL"
      ? "Design the scene so it can express both blessing and shadow tension in a single composition."
      : "Lean into the positive canonical expression of the card while preserving depth and tension.";

  const prompt = [
    styleBase,
    `${card.name} destiny card illustration`,
    `keywords: ${card.keywords.join(", ")}`,
    `positive meaning: ${card.positiveMeaning}`,
    `shadow meaning: ${card.shadowMeaning}`,
    categoryRule,
    polarityRule,
    `interpretation hint: ${card.interpretationHint}`
  ].join(", ");

  return {
    card,
    prompt,
    negativePrompt
  };
}
