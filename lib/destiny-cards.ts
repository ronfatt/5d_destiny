import { cardLocalizationMap } from "@/lib/card-localization";

export type CardCategory = "ARCHETYPE" | "ENERGY" | "EVENT";
export type CardValueMode = "FIXED" | "DUAL";

export type DestinyCardSeed = {
  cardKey: string;
  name: string;
  category: CardCategory;
  valueMode: CardValueMode;
  baseValue?: number;
  positiveValue?: number;
  negativeValue?: number;
  keywords: string[];
  positiveMeaning: string;
  shadowMeaning: string;
  interpretationHint: string;
  themeBias?: {
    career?: number;
    wealth?: number;
    love?: number;
    health?: number;
  };
};

type CardSeedMeta = Omit<DestinyCardSeed, "name" | "positiveMeaning" | "shadowMeaning">;

const cardSeedMeta: CardSeedMeta[] = [
  { cardKey: "archetype_ziwei", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 8, keywords: ["领导", "掌控"], interpretationHint: "适合领导窗口与资源统筹。", themeBias: { career: 3, wealth: 1 } },
  { cardKey: "archetype_tianfu", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 7, keywords: ["稳定", "资产"], interpretationHint: "适合积累、管理与稳健成长。", themeBias: { wealth: 3, health: 1 } },
  { cardKey: "archetype_tianxiang", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 6, keywords: ["秩序", "平衡"], interpretationHint: "适合谈判、制度与规则型推进。", themeBias: { career: 2, love: 1 } },
  { cardKey: "archetype_wuqu", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 7, keywords: ["执行", "商业"], interpretationHint: "适合商业行动和纪律性落地。", themeBias: { career: 3, wealth: 2 } },
  { cardKey: "archetype_sun", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 6, keywords: ["曝光", "影响"], interpretationHint: "适合品牌、公众表达与领导存在感。", themeBias: { career: 2, love: 1 } },
  { cardKey: "archetype_moon", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 5, keywords: ["资源", "情感"], interpretationHint: "适合关系、照顾与资源型议题。", themeBias: { wealth: 1, love: 2, health: 1 } },
  { cardKey: "archetype_tianji", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 6, keywords: ["策略", "变通"], interpretationHint: "适合转向、判断时机与解决问题。", themeBias: { career: 2, wealth: 1 } },
  { cardKey: "archetype_tianliang", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 5, keywords: ["保护", "指引"], interpretationHint: "适合风险控制和有贵人扶持的阶段。", themeBias: { health: 2, career: 1 } },
  { cardKey: "archetype_tiantong", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 4, keywords: ["缓和", "人缘"], interpretationHint: "适合修复关系与柔性过渡。", themeBias: { love: 2, health: 1 } },
  { cardKey: "archetype_lianzhen", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 5, negativeValue: -5, keywords: ["欲望", "权力"], interpretationHint: "节制时有高杠杆，不稳时风险高。", themeBias: { career: 2, love: -1 } },
  { cardKey: "archetype_tanlang", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 6, negativeValue: -6, keywords: ["魅力", "欲求"], interpretationHint: "适合吸引与扩张，不利过度放纵。", themeBias: { love: 2, wealth: 1 } },
  { cardKey: "archetype_jumen", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 3, negativeValue: -3, keywords: ["表达", "摩擦"], interpretationHint: "适合需要澄清与博弈的局面。", themeBias: { career: 1, love: -1 } },
  { cardKey: "archetype_pojun", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 6, negativeValue: -6, keywords: ["破局", "重组"], interpretationHint: "适合主动重启，不适合恐慌式决策。", themeBias: { career: 2, wealth: -1 } },
  { cardKey: "archetype_qisha", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 5, negativeValue: -7, keywords: ["果断", "风险"], interpretationHint: "只适合高把握度与强时机阶段。", themeBias: { career: 2, health: -1 } },

  { cardKey: "energy_awakening", category: "ENERGY", valueMode: "FIXED", baseValue: 6, keywords: ["觉醒", "认知"], interpretationHint: "通常表示内部层面的突破。", themeBias: { career: 1, love: 1 } },
  { cardKey: "energy_opportunity", category: "ENERGY", valueMode: "FIXED", baseValue: 5, keywords: ["机会", "窗口"], interpretationHint: "需要立刻跟进，拖延会失效。", themeBias: { career: 2, wealth: 2 } },
  { cardKey: "energy_hope", category: "ENERGY", valueMode: "FIXED", baseValue: 5, keywords: ["希望", "未来"], interpretationHint: "适合恢复期与重建期。", themeBias: { love: 1, health: 1 } },
  { cardKey: "energy_connection", category: "ENERGY", valueMode: "FIXED", baseValue: 4, keywords: ["连接", "支持"], interpretationHint: "适合合作、联盟与关系修复。", themeBias: { love: 2, career: 1 } },
  { cardKey: "energy_inspiration", category: "ENERGY", valueMode: "FIXED", baseValue: 4, keywords: ["灵感", "创意"], interpretationHint: "适合重新定位与概念成形阶段。", themeBias: { career: 1 } },
  { cardKey: "energy_growth", category: "ENERGY", valueMode: "FIXED", baseValue: 4, keywords: ["成长", "累积"], interpretationHint: "代表靠重复与积累形成进展。", themeBias: { career: 1, wealth: 1, health: 1 } },
  { cardKey: "energy_stability", category: "ENERGY", valueMode: "FIXED", baseValue: 3, keywords: ["稳定", "平衡"], interpretationHint: "适合扎实推进，不适合冒进。", themeBias: { wealth: 1, health: 1 } },
  { cardKey: "energy_learning", category: "ENERGY", valueMode: "FIXED", baseValue: 3, keywords: ["学习", "准备"], interpretationHint: "适合补课，不适合长期停在准备状态。", themeBias: { career: 1 } },
  { cardKey: "energy_recovery", category: "ENERGY", valueMode: "FIXED", baseValue: 3, keywords: ["恢复", "修复"], interpretationHint: "适合健康恢复与关系修补。", themeBias: { health: 2, love: 1 } },
  { cardKey: "energy_hesitation", category: "ENERGY", valueMode: "FIXED", baseValue: -2, keywords: ["犹豫", "拖延"], interpretationHint: "提醒你需要给自己一个决策阈值。", themeBias: { career: -1 } },
  { cardKey: "energy_confusion", category: "ENERGY", valueMode: "FIXED", baseValue: -3, keywords: ["困惑", "模糊"], interpretationHint: "先简化问题，再采取动作。", themeBias: { career: -1, love: -1 } },
  { cardKey: "energy_pressure", category: "ENERGY", valueMode: "FIXED", baseValue: -3, keywords: ["压力", "负荷"], interpretationHint: "只有在有结构时，压力才会变成推进力。", themeBias: { health: -2 } },
  { cardKey: "energy_temptation", category: "ENERGY", valueMode: "FIXED", baseValue: -4, keywords: ["诱惑", "分心"], interpretationHint: "要特别留意边界感与纪律感。", themeBias: { wealth: -1, love: -1 } },
  { cardKey: "energy_conflict", category: "ENERGY", valueMode: "FIXED", baseValue: -5, keywords: ["冲突", "摩擦"], interpretationHint: "没有策略时，不要升级冲突。", themeBias: { love: -2, career: -1 } },
  { cardKey: "energy_betrayal", category: "ENERGY", valueMode: "FIXED", baseValue: -6, keywords: ["背叛", "信任断裂"], interpretationHint: "先修边界，再谈扩张。", themeBias: { love: -3 } },
  { cardKey: "energy_loss_of_control", category: "ENERGY", valueMode: "FIXED", baseValue: -6, keywords: ["失控", "过载"], interpretationHint: "先降变量，再重建秩序。", themeBias: { health: -2, love: -1 } },
  { cardKey: "energy_lost", category: "ENERGY", valueMode: "FIXED", baseValue: -7, keywords: ["迷失", "失向"], interpretationHint: "需要先找回地面感与最小下一步。", themeBias: { career: -1, health: -1 } },
  { cardKey: "energy_closed", category: "ENERGY", valueMode: "FIXED", baseValue: -4, keywords: ["封闭", "退缩"], interpretationHint: "重新打开要渐进，不要一次过量。", themeBias: { love: -1 } },
  { cardKey: "energy_doubt", category: "ENERGY", valueMode: "FIXED", baseValue: -3, keywords: ["怀疑", "不确定"], interpretationHint: "把怀疑转成验证，而不是停住。", themeBias: { career: -1, wealth: -1 } },
  { cardKey: "energy_competition", category: "ENERGY", valueMode: "DUAL", positiveValue: 4, negativeValue: -4, keywords: ["竞争", "挑战"], interpretationHint: "准备足够时是助推，不足时是消耗。", themeBias: { career: 1, wealth: 1 } },
  { cardKey: "energy_gamble", category: "ENERGY", valueMode: "DUAL", positiveValue: 6, negativeValue: -6, keywords: ["赌局", "风险"], interpretationHint: "必须先看清下行边界。", themeBias: { wealth: 2 } },
  { cardKey: "energy_turning_point", category: "ENERGY", valueMode: "DUAL", positiveValue: 7, negativeValue: -7, keywords: ["转折", "拐点"], interpretationHint: "适合诚实评估自己是否真的准备好了。", themeBias: { career: 1, love: 1 } },

  { cardKey: "event_noble_support", category: "EVENT", valueMode: "FIXED", baseValue: 7, keywords: ["贵人", "扶持"], interpretationHint: "常与导师、介绍、关键帮助有关。", themeBias: { career: 2, wealth: 1 } },
  { cardKey: "event_window", category: "EVENT", valueMode: "FIXED", baseValue: 6, keywords: ["窗口", "时机"], interpretationHint: "这是现实动作牌，不是抽象象征牌。", themeBias: { career: 2, wealth: 2 } },
  { cardKey: "event_resources", category: "EVENT", valueMode: "FIXED", baseValue: 5, keywords: ["资源", "资本"], interpretationHint: "适合资金、工具、人脉或条件进入的阶段。", themeBias: { wealth: 3 } },
  { cardKey: "event_team", category: "EVENT", valueMode: "FIXED", baseValue: 4, keywords: ["团队", "协作"], interpretationHint: "关键看协作质量，而不是人多。", themeBias: { career: 2 } },
  { cardKey: "event_partnership", category: "EVENT", valueMode: "FIXED", baseValue: 4, keywords: ["合作", "盟友"], interpretationHint: "适合共同推进与关系修复。", themeBias: { love: 1, career: 1 } },
  { cardKey: "event_order", category: "EVENT", valueMode: "FIXED", baseValue: 6, keywords: ["订单", "回报"], interpretationHint: "适合业务、需求和实际收入议题。", themeBias: { wealth: 2, career: 1 } },
  { cardKey: "event_exposure", category: "EVENT", valueMode: "FIXED", baseValue: 5, keywords: ["曝光", "可见度"], interpretationHint: "适合发布、亮相与定位。", themeBias: { career: 2 } },
  { cardKey: "event_challenge", category: "EVENT", valueMode: "FIXED", baseValue: -4, keywords: ["挑战", "阻碍"], interpretationHint: "先分清什么是真瓶颈。", themeBias: { career: -1 } },
  { cardKey: "event_competitor", category: "EVENT", valueMode: "FIXED", baseValue: -4, keywords: ["对手", "竞争"], interpretationHint: "回应方式要靠定位，不靠慌张。", themeBias: { wealth: -1, career: -1 } },
  { cardKey: "event_loss", category: "EVENT", valueMode: "FIXED", baseValue: -6, keywords: ["损失", "下跌"], interpretationHint: "先保留选择权，再谈反攻。", themeBias: { wealth: -3 } },
  { cardKey: "event_clash", category: "EVENT", valueMode: "FIXED", baseValue: -5, keywords: ["冲撞", "争执"], interpretationHint: "要么迅速解决，要么明确隔离。", themeBias: { love: -2, career: -1 } },
  { cardKey: "event_change", category: "EVENT", valueMode: "DUAL", positiveValue: 5, negativeValue: -5, keywords: ["变动", "迁移"], interpretationHint: "好坏取决于你是否准备好了。", themeBias: { career: 1, health: -1 } },
  { cardKey: "event_departure", category: "EVENT", valueMode: "FIXED", baseValue: -6, keywords: ["离开", "结束"], interpretationHint: "先尊重结束，再谈替代方案。", themeBias: { love: -2, career: -1 } },
  { cardKey: "event_restart", category: "EVENT", valueMode: "FIXED", baseValue: 6, keywords: ["重启", "新周期"], interpretationHint: "适合结束后重新搭起更稳结构。", themeBias: { career: 1, health: 1 } }
];

export const destinyCardSeeds: DestinyCardSeed[] = cardSeedMeta.map((item) => {
  const localized = cardLocalizationMap[item.cardKey];

  if (!localized) {
    throw new Error(`Missing localization for card: ${item.cardKey}`);
  }

  return {
    ...item,
    name: localized.nameZh,
    positiveMeaning: localized.positiveZh,
    shadowMeaning: localized.shadowZh
  };
});

export function resolveCardValue(card: DestinyCardSeed) {
  if (card.valueMode === "FIXED") {
    return { value: card.baseValue ?? 0, polarity: "fixed" as const };
  }

  const usePositive = Math.random() >= 0.5;

  return {
    value: usePositive ? card.positiveValue ?? 0 : card.negativeValue ?? 0,
    polarity: usePositive ? ("positive" as const) : ("negative" as const)
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function round(value: number, precision = 2) {
  return Number(value.toFixed(precision));
}
