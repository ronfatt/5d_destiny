import type { ReadingTheme } from "@prisma/client";

export type ThemeKey = "career" | "wealth" | "love" | "health";

export type ThemeConfig = {
  key: ThemeKey;
  label: string;
  structure: number;
  timing: number;
};

export const themeConfigs: ThemeConfig[] = [
  { key: "career", label: "Career", structure: 74, timing: 1.08 },
  { key: "wealth", label: "Wealth", structure: 68, timing: 1.02 },
  { key: "love", label: "Love", structure: 61, timing: 0.98 },
  { key: "health", label: "Health", structure: 70, timing: 1.0 }
];

export function getThemeConfig(theme: ReadingTheme) {
  switch (theme) {
    case "CAREER":
      return themeConfigs[0];
    case "WEALTH":
      return themeConfigs[1];
    case "LOVE":
      return themeConfigs[2];
    case "HEALTH":
      return themeConfigs[3];
    default:
      return themeConfigs[0];
  }
}

export function mapActionRawToDisplay(actionRaw: number) {
  if (actionRaw <= 19) return -10;
  if (actionRaw <= 34) return -5;
  if (actionRaw <= 54) return 0;
  if (actionRaw <= 74) return 5;
  if (actionRaw <= 89) return 8;
  return 10;
}

export function getTrendLabel(score: number) {
  if (score < 40) return "Blocked";
  if (score < 60) return "Reorganizing";
  if (score < 80) return "Growing";
  if (score < 100) return "High Momentum";
  if (score < 121) return "Breakout";
  return "Strong Manifestation";
}

export function buildRiskFlags(energy: number, mind: number, actionRaw: number) {
  const flags: string[] = [];

  if (energy < 0) flags.push("energy_drag");
  if (mind < 1) flags.push("mind_instability");
  if (actionRaw < 55) flags.push("execution_gap");
  if (energy <= -10) flags.push("high_resistance_window");

  return flags;
}

export function computeThemeScore(
  config: ThemeConfig,
  energy: number,
  mind: number,
  actionRaw: number
) {
  const actionDisplay = mapActionRawToDisplay(actionRaw);
  const basePotential = Number((config.structure * config.timing).toFixed(2));
  const weighted = Number((((basePotential + energy) * mind) + actionDisplay).toFixed(2));
  const roundedScore = Math.round(weighted);
  const mindImpact = Number((((basePotential + energy) * mind) - (basePotential + energy)).toFixed(2));

  return {
    theme: config.key,
    label: config.label,
    structure: config.structure,
    timing: config.timing,
    energy,
    mind,
    actionRaw,
    actionDisplay,
    basePotential,
    mindImpact,
    score: roundedScore,
    preciseScore: weighted,
    trend: getTrendLabel(roundedScore)
  };
}

export function getDominantFactor(themeBreakdown: ReturnType<typeof computeThemeScore>) {
  const candidates = [
    { key: "structure_timing", value: themeBreakdown.basePotential },
    { key: "energy", value: Math.abs(themeBreakdown.energy) },
    { key: "mind", value: Math.abs(themeBreakdown.mindImpact) },
    { key: "action", value: Math.abs(themeBreakdown.actionDisplay) }
  ];

  candidates.sort((a, b) => b.value - a.value);
  return candidates[0]?.key ?? "structure_timing";
}
