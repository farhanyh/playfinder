export type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface Proficiencies {
  classDC?: number;
  perception?: number;
  fortitude?: number;
  reflex?: number;
  will?: number;
  heavy?: number;
  medium?: number;
  light?: number;
  unarmored?: number;
  advanced?: number;
  martial?: number;
  simple?: number;
  unarmed?: number;
  castingArcane?: number;
  castingDivine?: number;
  castingOccult?: number;
  castingPrimal?: number;
  acrobatics?: number;
  arcana?: number;
  athletics?: number;
  crafting?: number;
  deception?: number;
  diplomacy?: number;
  intimidation?: number;
  medicine?: number;
  nature?: number;
  occultism?: number;
  performance?: number;
  religion?: number;
  society?: number;
  stealth?: number;
  survival?: number;
  thievery?: number;
}

export type SkillToAbility = Record<keyof Proficiencies, Ability | "none">;
