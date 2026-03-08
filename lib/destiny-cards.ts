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

export const destinyCardSeeds: DestinyCardSeed[] = [
  { cardKey: "archetype_ziwei", name: "Ziwei Sovereign", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 8, keywords: ["leadership", "command"], positiveMeaning: "Leadership and central authority consolidate the situation.", shadowMeaning: "Control hardens into ego and rigidity.", interpretationHint: "Strong for leadership windows and top-down decisions.", themeBias: { career: 3, wealth: 1 } },
  { cardKey: "archetype_tianfu", name: "Tianfu Treasury", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 7, keywords: ["stability", "assets"], positiveMeaning: "Resources gather and stabilize around the user.", shadowMeaning: "Comfort can turn into inertia.", interpretationHint: "Supports accumulation, stewardship, and stable growth.", themeBias: { wealth: 3, health: 1 } },
  { cardKey: "archetype_tianxiang", name: "Tianxiang Order", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 6, keywords: ["order", "balance"], positiveMeaning: "Systems, rules, and diplomacy align the path.", shadowMeaning: "Over-compliance slows momentum.", interpretationHint: "Useful for structured negotiations and formal systems.", themeBias: { career: 2, love: 1 } },
  { cardKey: "archetype_wuqu", name: "Wuqu Execution", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 7, keywords: ["execution", "commerce"], positiveMeaning: "Decisive execution opens measurable progress.", shadowMeaning: "Over-pushing can drain relationships.", interpretationHint: "Strong for commercial action and disciplined output.", themeBias: { career: 3, wealth: 2 } },
  { cardKey: "archetype_sun", name: "Sun Radiance", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 6, keywords: ["visibility", "influence"], positiveMeaning: "Recognition, confidence, and external visibility rise.", shadowMeaning: "Exposure can create ego and overextension.", interpretationHint: "Works well for brand, publicity, and leadership presence.", themeBias: { career: 2, love: 1 } },
  { cardKey: "archetype_moon", name: "Moon Grace", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 5, keywords: ["resources", "emotion"], positiveMeaning: "Supportive resources and emotional intelligence become available.", shadowMeaning: "Mood fluctuation can reduce clarity.", interpretationHint: "Useful for finance, care work, and relational sensitivity.", themeBias: { wealth: 1, love: 2, health: 1 } },
  { cardKey: "archetype_tianji", name: "Tianji Strategy", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 6, keywords: ["planning", "adaptation"], positiveMeaning: "Strategy and adaptation create elegant openings.", shadowMeaning: "Overthinking delays commitment.", interpretationHint: "Useful when pivots, timing, and problem solving matter.", themeBias: { career: 2, wealth: 1 } },
  { cardKey: "archetype_tianliang", name: "Tianliang Guardian", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 5, keywords: ["protection", "guidance"], positiveMeaning: "Protection, ethics, and senior help reduce risk.", shadowMeaning: "Caution can become passivity.", interpretationHint: "Useful in risk management and mentor-assisted periods.", themeBias: { health: 2, career: 1 } },
  { cardKey: "archetype_tiantong", name: "Tiantong Ease", category: "ARCHETYPE", valueMode: "FIXED", baseValue: 4, keywords: ["ease", "rapport"], positiveMeaning: "Comfort, rapport, and emotional softening improve flow.", shadowMeaning: "Ease can become complacency.", interpretationHint: "Helps with relationship repair and softer transitions.", themeBias: { love: 2, health: 1 } },
  { cardKey: "archetype_lianzhen", name: "Lianzhen Desire", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 5, negativeValue: -5, keywords: ["desire", "authority"], positiveMeaning: "Desire sharpens ambition and strategic intensity.", shadowMeaning: "Obsession, politics, or control distort judgment.", interpretationHint: "High leverage when disciplined, risky when ego-led.", themeBias: { career: 2, love: -1 } },
  { cardKey: "archetype_tanlang", name: "Tanlang Charisma", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 6, negativeValue: -6, keywords: ["charisma", "appetite"], positiveMeaning: "Charisma attracts people, ideas, and opportunities.", shadowMeaning: "Temptation and indulgence scatter energy.", interpretationHint: "Strong for attraction and growth, weak for discipline.", themeBias: { love: 2, wealth: 1 } },
  { cardKey: "archetype_jumen", name: "Jumen Debate", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 3, negativeValue: -3, keywords: ["speech", "friction"], positiveMeaning: "Clarifying debate reveals truth and leverage.", shadowMeaning: "Arguments, doubt, and noise slow progress.", interpretationHint: "Use carefully in negotiation-heavy situations.", themeBias: { career: 1, love: -1 } },
  { cardKey: "archetype_pojun", name: "Pojun Breakthrough", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 6, negativeValue: -6, keywords: ["breakthrough", "reset"], positiveMeaning: "A necessary reset breaks open stale structures.", shadowMeaning: "Breakage comes before readiness and causes loss.", interpretationHint: "Best during deliberate reinvention, not panic moves.", themeBias: { career: 2, wealth: -1 } },
  { cardKey: "archetype_qisha", name: "Qisha Edge", category: "ARCHETYPE", valueMode: "DUAL", positiveValue: 5, negativeValue: -7, keywords: ["attack", "risk"], positiveMeaning: "Decisive courage cuts through stagnation.", shadowMeaning: "Aggression or speed creates damage.", interpretationHint: "Use when high conviction and strong timing are present.", themeBias: { career: 2, health: -1 } },

  { cardKey: "energy_awakening", name: "Awakening", category: "ENERGY", valueMode: "FIXED", baseValue: 6, keywords: ["realization"], positiveMeaning: "A fresh perspective unlocks movement.", shadowMeaning: "Insight without action stays theoretical.", interpretationHint: "Often signals internal breakthrough.", themeBias: { career: 1, love: 1 } },
  { cardKey: "energy_opportunity", name: "Opportunity", category: "ENERGY", valueMode: "FIXED", baseValue: 5, keywords: ["opening"], positiveMeaning: "A window is available now.", shadowMeaning: "Missing timing wastes the opening.", interpretationHint: "Acts best with immediate follow-through.", themeBias: { career: 2, wealth: 2 } },
  { cardKey: "energy_hope", name: "Hope", category: "ENERGY", valueMode: "FIXED", baseValue: 5, keywords: ["possibility"], positiveMeaning: "Future probability improves morale and endurance.", shadowMeaning: "Hope without structure becomes fantasy.", interpretationHint: "Good for recovery periods.", themeBias: { love: 1, health: 1 } },
  { cardKey: "energy_connection", name: "Connection", category: "ENERGY", valueMode: "FIXED", baseValue: 4, keywords: ["support"], positiveMeaning: "Mutual connection brings support and access.", shadowMeaning: "Weak boundaries can dilute focus.", interpretationHint: "Useful for alliances and relationship repair.", themeBias: { love: 2, career: 1 } },
  { cardKey: "energy_inspiration", name: "Inspiration", category: "ENERGY", valueMode: "FIXED", baseValue: 4, keywords: ["creativity"], positiveMeaning: "Creative direction becomes visible.", shadowMeaning: "Ideas may outpace execution.", interpretationHint: "Strong for concept work and reorientation.", themeBias: { career: 1 } },
  { cardKey: "energy_growth", name: "Growth", category: "ENERGY", valueMode: "FIXED", baseValue: 4, keywords: ["expansion"], positiveMeaning: "Steady improvement compounds.", shadowMeaning: "Growth stress requires capacity.", interpretationHint: "Signals progress through repetition.", themeBias: { career: 1, wealth: 1, health: 1 } },
  { cardKey: "energy_stability", name: "Stability", category: "ENERGY", valueMode: "FIXED", baseValue: 3, keywords: ["balance"], positiveMeaning: "Conditions stabilize enough for methodical progress.", shadowMeaning: "Stability can lower urgency.", interpretationHint: "Good when consolidation matters more than speed.", themeBias: { wealth: 1, health: 1 } },
  { cardKey: "energy_learning", name: "Learning", category: "ENERGY", valueMode: "FIXED", baseValue: 3, keywords: ["skill"], positiveMeaning: "Skill building improves future leverage.", shadowMeaning: "Staying in study mode can delay execution.", interpretationHint: "Useful in preparation phases.", themeBias: { career: 1 } },
  { cardKey: "energy_recovery", name: "Recovery", category: "ENERGY", valueMode: "FIXED", baseValue: 3, keywords: ["repair"], positiveMeaning: "Repair work restores capacity.", shadowMeaning: "Healing still requires pacing and boundaries.", interpretationHint: "Strong for burnout or health-related resets.", themeBias: { health: 2, love: 1 } },
  { cardKey: "energy_hesitation", name: "Hesitation", category: "ENERGY", valueMode: "FIXED", baseValue: -2, keywords: ["delay"], positiveMeaning: "Pause can prevent reckless action.", shadowMeaning: "Delay becomes avoidance.", interpretationHint: "Calls for a decision threshold.", themeBias: { career: -1 } },
  { cardKey: "energy_confusion", name: "Confusion", category: "ENERGY", valueMode: "FIXED", baseValue: -3, keywords: ["blur"], positiveMeaning: "Confusion reveals missing information.", shadowMeaning: "Direction stays unclear and energy leaks.", interpretationHint: "Needs simplification before action.", themeBias: { career: -1, love: -1 } },
  { cardKey: "energy_pressure", name: "Pressure", category: "ENERGY", valueMode: "FIXED", baseValue: -3, keywords: ["strain"], positiveMeaning: "Pressure can sharpen priorities.", shadowMeaning: "Load exceeds current capacity.", interpretationHint: "Useful only with structure and discipline.", themeBias: { health: -2 } },
  { cardKey: "energy_temptation", name: "Temptation", category: "ENERGY", valueMode: "FIXED", baseValue: -4, keywords: ["distraction"], positiveMeaning: "Desire exposes what the user truly values.", shadowMeaning: "Short-term craving derails long-term trajectory.", interpretationHint: "Watch discipline and boundary quality.", themeBias: { wealth: -1, love: -1 } },
  { cardKey: "energy_conflict", name: "Conflict", category: "ENERGY", valueMode: "FIXED", baseValue: -5, keywords: ["friction"], positiveMeaning: "Conflict reveals fault lines that need repair.", shadowMeaning: "Tension absorbs energy and damages trust.", interpretationHint: "Avoid escalation without strategy.", themeBias: { love: -2, career: -1 } },
  { cardKey: "energy_betrayal", name: "Betrayal", category: "ENERGY", valueMode: "FIXED", baseValue: -6, keywords: ["trust-break"], positiveMeaning: "Pain forces clearer standards.", shadowMeaning: "Trust damage collapses momentum.", interpretationHint: "Needs boundary repair before expansion.", themeBias: { love: -3 } },
  { cardKey: "energy_loss_of_control", name: "Loss Of Control", category: "ENERGY", valueMode: "FIXED", baseValue: -6, keywords: ["overwhelm"], positiveMeaning: "Overload signals a reset is overdue.", shadowMeaning: "Unmanaged emotion drives poor choices.", interpretationHint: "Reduce variables before moving again.", themeBias: { health: -2, love: -1 } },
  { cardKey: "energy_lost", name: "Lost", category: "ENERGY", valueMode: "FIXED", baseValue: -7, keywords: ["directionless"], positiveMeaning: "Being lost can force honest re-evaluation.", shadowMeaning: "Meaning and momentum drop together.", interpretationHint: "Needs grounding and a small next step.", themeBias: { career: -1, health: -1 } },
  { cardKey: "energy_closed", name: "Closed", category: "ENERGY", valueMode: "FIXED", baseValue: -4, keywords: ["withdrawal"], positiveMeaning: "Withdrawal protects energy temporarily.", shadowMeaning: "Self-protection becomes self-limitation.", interpretationHint: "Re-open gradually, not all at once.", themeBias: { love: -1 } },
  { cardKey: "energy_doubt", name: "Doubt", category: "ENERGY", valueMode: "FIXED", baseValue: -3, keywords: ["uncertainty"], positiveMeaning: "Doubt can improve due diligence.", shadowMeaning: "Confidence erosion stops motion.", interpretationHint: "Useful only if converted into verification.", themeBias: { career: -1, wealth: -1 } },
  { cardKey: "energy_competition", name: "Competition", category: "ENERGY", valueMode: "DUAL", positiveValue: 4, negativeValue: -4, keywords: ["challenge"], positiveMeaning: "Competition sharpens standards and performance.", shadowMeaning: "Comparison drains confidence and focus.", interpretationHint: "Strong if the user is prepared, weak if reactive.", themeBias: { career: 1, wealth: 1 } },
  { cardKey: "energy_gamble", name: "Gamble", category: "ENERGY", valueMode: "DUAL", positiveValue: 6, negativeValue: -6, keywords: ["risk"], positiveMeaning: "Calculated risk creates outsized upside.", shadowMeaning: "Unstructured risk creates avoidable loss.", interpretationHint: "Only healthy when downside is consciously bounded.", themeBias: { wealth: 2 } },
  { cardKey: "energy_turning_point", name: "Turning Point", category: "ENERGY", valueMode: "DUAL", positiveValue: 7, negativeValue: -7, keywords: ["pivot"], positiveMeaning: "A decisive pivot opens the next chapter.", shadowMeaning: "A turn arrives before the user is stable enough to handle it.", interpretationHint: "Requires honesty about readiness.", themeBias: { career: 1, love: 1 } },

  { cardKey: "event_noble_support", name: "Noble Support", category: "EVENT", valueMode: "FIXED", baseValue: 7, keywords: ["helper"], positiveMeaning: "Outside support enters at the right time.", shadowMeaning: "Support still needs response and follow-through.", interpretationHint: "Often linked to mentors, referrals, or senior allies.", themeBias: { career: 2, wealth: 1 } },
  { cardKey: "event_window", name: "Opportunity Window", category: "EVENT", valueMode: "FIXED", baseValue: 6, keywords: ["timing"], positiveMeaning: "A time-sensitive opening appears in the real world.", shadowMeaning: "Window closes if ignored.", interpretationHint: "Treat this as actionable, not symbolic.", themeBias: { career: 2, wealth: 2 } },
  { cardKey: "event_resources", name: "Resources", category: "EVENT", valueMode: "FIXED", baseValue: 5, keywords: ["capital"], positiveMeaning: "Money, tools, or infrastructure become available.", shadowMeaning: "Resources can still be misallocated.", interpretationHint: "Good for operational movement.", themeBias: { wealth: 3 } },
  { cardKey: "event_team", name: "Team", category: "EVENT", valueMode: "FIXED", baseValue: 4, keywords: ["support-system"], positiveMeaning: "Shared effort increases capacity.", shadowMeaning: "Coordination quality becomes decisive.", interpretationHint: "Strong for collaborative execution.", themeBias: { career: 2 } },
  { cardKey: "event_partnership", name: "Partnership", category: "EVENT", valueMode: "FIXED", baseValue: 4, keywords: ["ally"], positiveMeaning: "A useful alliance enters or strengthens.", shadowMeaning: "Alignment matters more than excitement.", interpretationHint: "Useful for joint moves and relationship repair.", themeBias: { love: 1, career: 1 } },
  { cardKey: "event_order", name: "Order", category: "EVENT", valueMode: "FIXED", baseValue: 6, keywords: ["revenue"], positiveMeaning: "A direct revenue or demand signal appears.", shadowMeaning: "Delivery capacity must match the opportunity.", interpretationHint: "Very practical card for business momentum.", themeBias: { wealth: 2, career: 1 } },
  { cardKey: "event_exposure", name: "Exposure", category: "EVENT", valueMode: "FIXED", baseValue: 5, keywords: ["visibility"], positiveMeaning: "Public visibility rises.", shadowMeaning: "More eyes also increase scrutiny.", interpretationHint: "Useful for launches and positioning.", themeBias: { career: 2 } },
  { cardKey: "event_challenge", name: "Challenge", category: "EVENT", valueMode: "FIXED", baseValue: -4, keywords: ["obstacle"], positiveMeaning: "Obstacle reveals the real bottleneck.", shadowMeaning: "Progress slows under resistance.", interpretationHint: "Needs disciplined triage.", themeBias: { career: -1 } },
  { cardKey: "event_competitor", name: "Competitor", category: "EVENT", valueMode: "FIXED", baseValue: -4, keywords: ["rival"], positiveMeaning: "Competition clarifies differentiation.", shadowMeaning: "Rival pressure reduces margin and certainty.", interpretationHint: "Respond with positioning, not panic.", themeBias: { wealth: -1, career: -1 } },
  { cardKey: "event_loss", name: "Loss", category: "EVENT", valueMode: "FIXED", baseValue: -6, keywords: ["damage"], positiveMeaning: "Loss forces stronger systems.", shadowMeaning: "Money or confidence drops sharply.", interpretationHint: "Preserve optionality first.", themeBias: { wealth: -3 } },
  { cardKey: "event_clash", name: "Clash", category: "EVENT", valueMode: "FIXED", baseValue: -5, keywords: ["dispute"], positiveMeaning: "Conflict clarifies hidden tension.", shadowMeaning: "Relationship strain disrupts execution.", interpretationHint: "Resolve quickly or contain it.", themeBias: { love: -2, career: -1 } },
  { cardKey: "event_change", name: "Change", category: "EVENT", valueMode: "DUAL", positiveValue: 5, negativeValue: -5, keywords: ["shift"], positiveMeaning: "External change creates a strategic opening.", shadowMeaning: "Instability forces reaction instead of design.", interpretationHint: "Good or bad depends on readiness.", themeBias: { career: 1, health: -1 } },
  { cardKey: "event_departure", name: "Departure", category: "EVENT", valueMode: "FIXED", baseValue: -6, keywords: ["ending"], positiveMeaning: "An ending makes room for the correct next phase.", shadowMeaning: "Separation destabilizes the current system.", interpretationHint: "Respect the loss before forcing replacement.", themeBias: { love: -2, career: -1 } },
  { cardKey: "event_restart", name: "Restart", category: "EVENT", valueMode: "FIXED", baseValue: 6, keywords: ["renewal"], positiveMeaning: "A fresh cycle begins with stronger clarity.", shadowMeaning: "Restart still requires disciplined rebuilding.", interpretationHint: "Powerful after completion or collapse.", themeBias: { career: 1, health: 1 } }
];

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
