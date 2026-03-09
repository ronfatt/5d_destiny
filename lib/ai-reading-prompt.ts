export const themeLabelMap = {
  career: "事业",
  wealth: "财富",
  love: "感情",
  health: "健康"
} as const;

export const trendLabelMap: Record<string, string> = {
  Blocked: "阻滞期",
  Reorganizing: "整理期",
  Growing: "成长期",
  "High Momentum": "高势期",
  Breakout: "突破期",
  "Strong Manifestation": "兑现期"
};

export const dominantFactorMap: Record<string, string> = {
  structure_timing: "命盘结构与时运窗口",
  energy: "当前能量变化",
  mind: "心念状态",
  action: "行动力度"
};

export const riskFlagMap: Record<string, string> = {
  energy_drag: "能量拖拽",
  mind_instability: "情绪与判断波动",
  execution_gap: "行动执行不足",
  high_resistance_window: "阻力窗口偏强"
};

export const palaceLabelMap: Record<string, string> = {
  life: "命宫",
  siblings: "兄弟宫",
  spouse: "夫妻宫",
  children: "子女宫",
  wealth: "财帛宫",
  health: "疾厄宫",
  travel: "迁移宫",
  friends: "交友宫",
  career: "官禄宫",
  property: "田宅宫",
  fortune: "福德宫",
  parents: "父母宫"
};

export const starLabelMap: Record<string, string> = {
  ziwei: "紫微",
  tianfu: "天府",
  tianxiang: "天相",
  wuqu: "武曲",
  sun: "太阳",
  moon: "太阴",
  tianji: "天机",
  tianliang: "天梁",
  tiantong: "天同",
  lianzhen: "廉贞",
  tanlang: "贪狼",
  jumen: "巨门",
  pojun: "破军",
  qisha: "七杀"
};

export function toThemeKey(theme: string) {
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

export function getTimeWindow(timing: number, trend?: string) {
  if (timing >= 1.12 || trend === "Strong Manifestation") return "未来1-3个月";
  if (timing >= 1.04 || trend === "Breakout" || trend === "High Momentum") return "未来3-6个月";
  if (timing >= 0.95) return "未来6个月左右";
  return "未来1-2个月先观察，再看后续3个月变化";
}

export function extractReportSections(reportText: string) {
  const matches = [...reportText.matchAll(/^##\s+(.+)\n([\s\S]*?)(?=^##\s+.+|$)/gm)];
  const sections = Object.fromEntries(
    matches.map((match) => [match[1].trim(), match[2].trim()])
  ) as Record<string, string>;

  return sections;
}

type NarrativePromptInput = {
  reading: {
    id: string;
    theme: string;
    question: string;
    title?: string | null;
    note?: string | null;
  };
  birthProfile: {
    birthLocation?: string | null;
    timezone?: string | null;
    gender?: string | null;
  };
  questionnaire: {
    mindAverage: number;
    mindFactor: number;
    actionTotal: number;
    actionRaw: number;
    actionLabel: string;
  };
  focusTheme: {
    key: string;
    label: string;
    trend?: string;
    score?: number;
    structure?: number;
    timing?: number;
    energy?: number;
    mind?: number;
    actionDisplay?: number;
  };
  dominantFactor: string;
  riskFlags: string[];
  ziwei: {
    engineVersion?: string;
    school?: string;
    lifePalace?: { key?: string; label?: string } | null;
    bodyPalace?: { key?: string; label?: string } | null;
    focusPalaces?: Array<{
      palaceLabel: string;
      weight: number;
      score: number;
      stars: string[];
    }>;
  };
  cards: {
    archetype?: { name?: string; value?: number; polarity?: string; meaning?: string };
    energy1?: { name?: string; value?: number; polarity?: string; meaning?: string };
    energy2?: { name?: string; value?: number; polarity?: string; meaning?: string };
    event?: { name?: string; value?: number; polarity?: string; meaning?: string };
    mappedEnergyScore?: number;
  };
};

export function buildReadingNarrativePrompts(input: NarrativePromptInput) {
  const systemPrompt = [
    "你是五维命运系统的专业解盘师。",
    "你的任务不是解释工程字段，而是写出一份像命理师解盘的中文报告。",
    "必须严格基于给定数据，不得虚构不存在的紫微主星、四化、大运、牌面或事件。",
    "可以做合理推演，但必须建立在输入数据上。",
    "不要使用 Structure、Timing、Energy、Mind、Action 这类英文工程词做标题。",
    "不要写成 AI 总结或数据说明书。语言要像在对用户直接解盘。",
    "必须输出以下标题，并按此顺序：",
    "## 命运结论",
    "## 紫微命盘解释",
    "## 命运卡解释",
    "## 现实可能事件",
    "## 风险提醒",
    "## 行动建议",
    "## 解读依据",
    "其中：",
    "1. 命运结论必须先给一句核心判断，再给一个时间窗口。",
    "2. 紫微命盘解释必须明确提到命宫、身宫，以及当前主题最关键的宫位。",
    "3. 命运卡解释必须提到本次抽到的牌名，以及它们如何与命盘结构互动。",
    "4. 现实可能事件必须给 3-5 条具体、现实、可感知的事件类型。",
    "5. 风险提醒必须指出当前最容易出问题的地方。",
    "6. 行动建议必须给 3 条可执行建议，使用编号列表。",
    "7. 解读依据必须说明：本次解读基于紫微斗数命盘结构、命运卡能量抽取、五维评分模型、AI综合推演。",
    "不要输出代码块。"
  ].join("\n");

  const userPrompt = JSON.stringify(input, null, 2);

  return { systemPrompt, userPrompt };
}
