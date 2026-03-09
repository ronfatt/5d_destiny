export type CardLocalization = {
  nameZh: string;
  positiveZh: string;
  shadowZh: string;
};

export const cardLocalizationMap: Record<string, CardLocalization> = {
  archetype_ziwei: { nameZh: "紫微帝星", positiveZh: "领导力与核心掌控力开始集中，局面更容易由你主导。", shadowZh: "控制欲变强，容易把判断僵化成自我中心。" },
  archetype_tianfu: { nameZh: "天府宝库", positiveZh: "资源逐步聚拢，适合稳健积累与布局。", shadowZh: "过度求稳会拖慢推进节奏。" },
  archetype_tianxiang: { nameZh: "天相秩序", positiveZh: "规则、结构与协调能力开始发挥作用。", shadowZh: "过度顾全会让决策失去锋利度。" },
  archetype_wuqu: { nameZh: "武曲执行", positiveZh: "执行力正在打开局面，结果会开始落地。", shadowZh: "过度硬推会伤到关系与协作空间。" },
  archetype_sun: { nameZh: "太阳光耀", positiveZh: "曝光、信心与影响力正在上升。", shadowZh: "太想证明自己，反而容易透支。" },
  archetype_moon: { nameZh: "太阴月华", positiveZh: "资源感、情绪感知与支持系统开始增强。", shadowZh: "情绪波动会削弱判断清晰度。" },
  archetype_tianji: { nameZh: "天机智谋", positiveZh: "策略与转向能力会帮你找到更好的入口。", shadowZh: "想得太多会拖慢落地速度。" },
  archetype_tianliang: { nameZh: "天梁守护", positiveZh: "保护、伦理与贵人力量在帮你降风险。", shadowZh: "太谨慎会让自己停在安全区。" },
  archetype_tiantong: { nameZh: "天同福乐", positiveZh: "关系缓和、节奏放松，局面更容易顺下来。", shadowZh: "舒服感会变成懈怠。" },
  archetype_lianzhen: { nameZh: "廉贞权欲", positiveZh: "欲望会转成 ambition，推动你争取位置与结果。", shadowZh: "执念、权力感或情绪对抗会扭曲判断。" },
  archetype_tanlang: { nameZh: "贪狼魅力", positiveZh: "吸引力增强，更容易带来人脉与机会。", shadowZh: "欲望分散，会让注意力和能量跑掉。" },
  archetype_jumen: { nameZh: "巨门争议", positiveZh: "讲清问题反而能让你找到关键突破口。", shadowZh: "口舌、误解与怀疑会拖慢进展。" },
  archetype_pojun: { nameZh: "破军破局", positiveZh: "旧结构被打破，新局面开始露出入口。", shadowZh: "在还没准备好时硬拆旧局，会先失后得。" },
  archetype_qisha: { nameZh: "七杀锋刃", positiveZh: "果断与魄力会帮助你切开停滞。", shadowZh: "太急太猛，容易先造成损耗。" },

  energy_awakening: { nameZh: "觉醒", positiveZh: "新的认知角度出现，事情开始松动。", shadowZh: "有了洞察却不行动，变化就停在想法层。" },
  energy_opportunity: { nameZh: "机会", positiveZh: "眼前确实有一个可以接住的窗口。", shadowZh: "如果反应太慢，机会会直接错过。" },
  energy_hope: { nameZh: "希望", positiveZh: "未来感变强，足以支撑你继续往前。", shadowZh: "只有期待、没有结构，容易变成空想。" },
  energy_connection: { nameZh: "连接", positiveZh: "关系中的支持与连接正在形成助力。", shadowZh: "边界不清会让你被别人带偏。" },
  energy_inspiration: { nameZh: "灵感", positiveZh: "创意和方向感开始浮现。", shadowZh: "灵感太多、执行太少，会继续停在概念层。" },
  energy_growth: { nameZh: "成长", positiveZh: "缓慢但稳定的进步已经开始累积。", shadowZh: "成长会带来压力，容量不够就容易失衡。" },
  energy_stability: { nameZh: "稳定", positiveZh: "环境开始稳下来，适合扎实推进。", shadowZh: "太稳定也可能降低行动紧迫感。" },
  energy_learning: { nameZh: "学习", positiveZh: "现在更适合补技能、补认知、补方法。", shadowZh: "一直准备却不出手，会延误时机。" },
  energy_recovery: { nameZh: "恢复", positiveZh: "修复正在发生，状态会慢慢回升。", shadowZh: "恢复期如果乱冲，会再次透支。" },
  energy_hesitation: { nameZh: "犹豫", positiveZh: "暂停能避免你做错决定。", shadowZh: "拖延太久就会变成错失。" },
  energy_confusion: { nameZh: "困惑", positiveZh: "困惑提醒你还缺关键信息。", shadowZh: "方向不明会持续漏能量。" },
  energy_pressure: { nameZh: "压力", positiveZh: "压力会逼你看清真正优先级。", shadowZh: "负荷已经接近上限，再压就会失控。" },
  energy_temptation: { nameZh: "诱惑", positiveZh: "欲望让你看见自己真正想抓住什么。", shadowZh: "短期诱惑会打散长期节奏。" },
  energy_conflict: { nameZh: "冲突", positiveZh: "冲突让隐藏问题浮到台面。", shadowZh: "持续对抗会消耗关系与判断。" },
  energy_betrayal: { nameZh: "背叛", positiveZh: "痛点会迫使你建立更高标准。", shadowZh: "信任受损会直接拖垮推进。" },
  energy_loss_of_control: { nameZh: "失控", positiveZh: "这在提醒你已经到了必须重置的时候。", shadowZh: "情绪一旦失控，选择就容易出错。" },
  energy_lost: { nameZh: "迷失", positiveZh: "迷失会逼你重新确认真正方向。", shadowZh: "意义感与动力一起下降。" },
  energy_closed: { nameZh: "封闭", positiveZh: "暂时收缩是在保护自己。", shadowZh: "封闭太久会把自己困住。" },
  energy_doubt: { nameZh: "怀疑", positiveZh: "怀疑能让你做更严谨的确认。", shadowZh: "信心持续下降会让行动停住。" },
  energy_competition: { nameZh: "竞争", positiveZh: "竞争会拉高你的标准和表现。", shadowZh: "比较心太重会反过来消耗你。" },
  energy_gamble: { nameZh: "赌局", positiveZh: "算清边界后的冒险，可能带来超额回报。", shadowZh: "没有风控的下注，会直接形成损失。" },
  energy_turning_point: { nameZh: "转折", positiveZh: "关键转向已经出现，新阶段要开始了。", shadowZh: "变化来得太快，你可能还没准备好。" },

  event_noble_support: { nameZh: "贵人", positiveZh: "现实里会出现能帮你一把的人。", shadowZh: "别人愿意帮，但你也得接得住。" },
  event_window: { nameZh: "机会窗口", positiveZh: "现实世界里会出现一个短期但重要的入口。", shadowZh: "如果没有及时动作，窗口会很快关掉。" },
  event_resources: { nameZh: "资源", positiveZh: "钱、工具、人脉或条件开始进入场域。", shadowZh: "资源到了，不代表一定会用对。" },
  event_team: { nameZh: "团队", positiveZh: "协作关系会提高你的执行容量。", shadowZh: "团队效率决定结果，不是人多就有用。" },
  event_partnership: { nameZh: "合作", positiveZh: "有价值的联盟或合作关系会出现。", shadowZh: "合作前先看是否真正同频。" },
  event_order: { nameZh: "订单", positiveZh: "现实里会出现更直接的回报或需求信号。", shadowZh: "机会来了，也要看你接单能力够不够。" },
  event_exposure: { nameZh: "曝光", positiveZh: "外部看见你的概率正在提高。", shadowZh: "被看见的同时，也会被放大检视。" },
  event_challenge: { nameZh: "挑战", positiveZh: "障碍会逼你看见真正卡点。", shadowZh: "如果处理不好，进度会明显变慢。" },
  event_competitor: { nameZh: "竞争对手", positiveZh: "对手会迫使你更清楚自己的定位。", shadowZh: "外部压力会压缩空间与信心。" },
  event_loss: { nameZh: "损失", positiveZh: "损失会倒逼你建立更稳的系统。", shadowZh: "钱、资源或信心会先掉一截。" },
  event_clash: { nameZh: "冲撞", positiveZh: "正面冲突会让隐藏矛盾浮现。", shadowZh: "关系紧张会直接影响执行。" },
  event_change: { nameZh: "变动", positiveZh: "外部变化会带来新机会。", shadowZh: "环境变化太快，会迫使你被动反应。" },
  event_departure: { nameZh: "离开", positiveZh: "一个结束会为新阶段腾出位置。", shadowZh: "分离会先让系统失衡。" },
  event_restart: { nameZh: "重启", positiveZh: "一个新的周期会在更清晰的状态下开始。", shadowZh: "重启不等于轻松，还是要重新搭结构。" }
};

export function getCardNameZh(cardKey: string, fallback?: string | null) {
  return cardLocalizationMap[cardKey]?.nameZh ?? fallback ?? cardKey;
}

export function getCardMeaningZh(cardKey: string, polarity: string | undefined, fallback?: string | null) {
  const record = cardLocalizationMap[cardKey];
  if (!record) return fallback ?? undefined;
  return polarity === "negative" ? record.shadowZh : record.positiveZh;
}
