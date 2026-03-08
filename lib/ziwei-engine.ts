import type { BirthProfile, ReadingTheme } from "@prisma/client";

export type ZiweiThemeKey = "career" | "wealth" | "love" | "health";

type ThemeBias = Record<ZiweiThemeKey, number>;

type StarProfile = {
  key: string;
  label: string;
  baseScore: number;
  timingBias: number;
  themeBias: ThemeBias;
};

type PalaceScore = {
  index: number;
  key: string;
  label: string;
  branch: string;
  stars: StarProfile[];
  score: number;
};

export type ThemeInputs = {
  key: ZiweiThemeKey;
  label: string;
  structure: number;
  timing: number;
  palaceBreakdown: Array<{
    palaceKey: string;
    palaceLabel: string;
    weight: number;
    score: number;
  }>;
};

export type ZiweiChartResult = {
  engineVersion: string;
  school: string;
  normalizedTime: {
    solar: string;
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    hourBranch: string;
  };
  lifePalace: { index: number; key: string; label: string };
  bodyPalace: { index: number; key: string; label: string };
  palaces: PalaceScore[];
  themes: Record<ZiweiThemeKey, ThemeInputs>;
};

const branches = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];

const palaces = [
  { key: "life", label: "Life" },
  { key: "siblings", label: "Siblings" },
  { key: "spouse", label: "Spouse" },
  { key: "children", label: "Children" },
  { key: "wealth", label: "Wealth" },
  { key: "health", label: "Health" },
  { key: "travel", label: "Travel" },
  { key: "friends", label: "Friends" },
  { key: "career", label: "Career" },
  { key: "property", label: "Property" },
  { key: "fortune", label: "Fortune" },
  { key: "parents", label: "Parents" }
] as const;

const palaceImportance: Record<string, number> = {
  life: 8,
  siblings: -2,
  spouse: 5,
  children: 1,
  wealth: 7,
  health: 5,
  travel: 2,
  friends: -1,
  career: 8,
  property: 4,
  fortune: 5,
  parents: 1
};

const stars: StarProfile[] = [
  { key: "ziwei", label: "Ziwei", baseScore: 86, timingBias: 3, themeBias: { career: 5, wealth: 3, love: 2, health: 2 } },
  { key: "tianfu", label: "Tianfu", baseScore: 84, timingBias: 2, themeBias: { career: 3, wealth: 5, love: 2, health: 3 } },
  { key: "tianxiang", label: "Tianxiang", baseScore: 81, timingBias: 2, themeBias: { career: 4, wealth: 2, love: 3, health: 2 } },
  { key: "wuqu", label: "Wuqu", baseScore: 80, timingBias: 2, themeBias: { career: 5, wealth: 4, love: 1, health: 2 } },
  { key: "sun", label: "Sun", baseScore: 78, timingBias: 3, themeBias: { career: 4, wealth: 2, love: 2, health: 2 } },
  { key: "moon", label: "Moon", baseScore: 77, timingBias: 1, themeBias: { career: 2, wealth: 3, love: 4, health: 3 } },
  { key: "tianji", label: "Tianji", baseScore: 75, timingBias: 4, themeBias: { career: 4, wealth: 2, love: 2, health: 2 } },
  { key: "tianliang", label: "Tianliang", baseScore: 74, timingBias: 2, themeBias: { career: 3, wealth: 2, love: 2, health: 5 } },
  { key: "tiantong", label: "Tiantong", baseScore: 72, timingBias: 1, themeBias: { career: 2, wealth: 2, love: 4, health: 4 } },
  { key: "lianzhen", label: "Lianzhen", baseScore: 70, timingBias: 1, themeBias: { career: 4, wealth: 2, love: 1, health: 1 } },
  { key: "tanlang", label: "Tanlang", baseScore: 69, timingBias: 3, themeBias: { career: 3, wealth: 3, love: 4, health: 1 } },
  { key: "jumen", label: "Jumen", baseScore: 65, timingBias: 2, themeBias: { career: 3, wealth: 1, love: 1, health: 1 } },
  { key: "pojun", label: "Pojun", baseScore: 62, timingBias: 4, themeBias: { career: 4, wealth: 1, love: 1, health: 1 } },
  { key: "qisha", label: "Qisha", baseScore: 60, timingBias: 3, themeBias: { career: 4, wealth: 1, love: 1, health: 1 } }
];

const themeWeights: Record<ZiweiThemeKey, Record<string, number>> = {
  career: { career: 0.35, life: 0.2, travel: 0.15, wealth: 0.1, fortune: 0.1, body: 0.1 },
  wealth: { wealth: 0.35, property: 0.2, career: 0.15, life: 0.1, fortune: 0.1, travel: 0.1 },
  love: { spouse: 0.4, life: 0.15, fortune: 0.15, children: 0.1, travel: 0.1, body: 0.1 },
  health: { health: 0.4, life: 0.2, fortune: 0.15, body: 0.1, travel: 0.1, property: 0.05 }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number, precision = 2) {
  return Number(value.toFixed(precision));
}

function parseBirthProfile(profile: Pick<BirthProfile, "birthDate" | "birthTime" | "timezone">) {
  const date = new Date(profile.birthDate);
  const [hourString, minuteString] = profile.birthTime.split(":");
  const hour = Number(hourString || "0");
  const minute = Number(minuteString || "0");
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hourBranchIndex = Math.floor(((hour + 1) % 24) / 2);

  return {
    solar: `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`,
    date: `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
    time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    year,
    month,
    day,
    hour,
    minute,
    hourBranch: branches[hourBranchIndex],
    hourBranchIndex
  };
}

function buildPalaces(normalized: ReturnType<typeof parseBirthProfile>) {
  const lifeIndex = (normalized.month + normalized.hourBranchIndex + 11) % 12;
  const bodyIndex = (normalized.month + (12 - normalized.hourBranchIndex)) % 12;
  const starSeed = normalized.year + normalized.month * 3 + normalized.day + normalized.hourBranchIndex * 5;

  return palaces.map((palace, idx) => {
    const firstStar = stars[(starSeed + idx * 2) % stars.length];
    const secondStar = stars[(starSeed + idx * 2 + 7) % stars.length];
    const assignedStars = idx % 3 === 0 ? [firstStar, secondStar] : [firstStar];
    const avgBase = assignedStars.reduce((sum, star) => sum + star.baseScore, 0) / assignedStars.length;
    const score = clamp(round(avgBase + (palaceImportance[palace.key] ?? 0), 2), 40, 96);

    return {
      index: idx,
      key: palace.key,
      label: palace.label,
      branch: branches[idx],
      stars: assignedStars,
      score,
      isLife: idx === lifeIndex,
      isBody: idx === bodyIndex
    };
  });
}

function getCurrentCycleIndex(referenceDate = new Date()) {
  return (referenceDate.getUTCFullYear() + (referenceDate.getUTCMonth() + 1)) % 12;
}

function buildThemeInputs(palaceScores: ReturnType<typeof buildPalaces>, normalized: ReturnType<typeof parseBirthProfile>) {
  const bodyPalace = palaceScores.find((item) => item.isBody)!;
  const currentCycleIndex = getCurrentCycleIndex();
  const monthDrift = ((normalized.month - 1) % 12) / 11;

  const themes = Object.entries(themeWeights).map(([themeKey, weights]) => {
    const palaceBreakdown = Object.entries(weights).map(([palaceKey, weight]) => {
      const palace = palaceKey === "body" ? bodyPalace : palaceScores.find((item) => item.key === palaceKey)!;
      return {
        palaceKey,
        palaceLabel: palaceKey === "body" ? `Body (${palace.label})` : palace.label,
        weight,
        score: palace.score
      };
    });

    const structure = clamp(
      round(palaceBreakdown.reduce((sum, item) => sum + item.score * item.weight, 0), 2),
      40,
      96
    );

    const timingRaw = palaceBreakdown.reduce((sum, item) => {
      const palace = item.palaceKey === "body" ? bodyPalace : palaceScores.find((entry) => entry.key === item.palaceKey)!;
      const branchDistance = Math.min(
        Math.abs(palace.index - currentCycleIndex),
        12 - Math.abs(palace.index - currentCycleIndex)
      );
      const branchBoost = 1 - branchDistance / 6;
      const starTiming = palace.stars.reduce((acc, star) => acc + star.timingBias, 0) / palace.stars.length;
      return sum + (branchBoost * 0.08 + starTiming * 0.01) * item.weight;
    }, 1 + monthDrift * 0.02 - 0.01);

    const timing = clamp(round(timingRaw, 2), 0.82, 1.18);

    return {
      key: themeKey as ZiweiThemeKey,
      label: themeKey.charAt(0).toUpperCase() + themeKey.slice(1),
      structure,
      timing,
      palaceBreakdown
    };
  });

  return Object.fromEntries(themes.map((item) => [item.key, item])) as Record<ZiweiThemeKey, ThemeInputs>;
}

export function generateZiweiChart(profile: Pick<BirthProfile, "birthDate" | "birthTime" | "timezone">): ZiweiChartResult {
  const normalizedTime = parseBirthProfile(profile);
  const palaceScores = buildPalaces(normalizedTime);
  const themes = buildThemeInputs(palaceScores, normalizedTime);
  const lifePalace = palaceScores.find((item) => item.isLife)!;
  const bodyPalace = palaceScores.find((item) => item.isBody)!;

  return {
    engineVersion: "preset_A_v0.1",
    school: "preset_A",
    normalizedTime,
    lifePalace: { index: lifePalace.index, key: lifePalace.key, label: lifePalace.label },
    bodyPalace: { index: bodyPalace.index, key: bodyPalace.key, label: bodyPalace.label },
    palaces: palaceScores.map(({ isLife: _isLife, isBody: _isBody, ...rest }) => rest),
    themes
  };
}

export function getThemeFromReading(theme: ReadingTheme): ZiweiThemeKey {
  switch (theme) {
    case "CAREER":
      return "career";
    case "WEALTH":
      return "wealth";
    case "LOVE":
      return "love";
    case "HEALTH":
      return "health";
    default:
      return "career";
  }
}
