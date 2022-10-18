import { Ability } from "./Character";

export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "UNIQUE";
export type CreatureSize =
  | "TINY"
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "HUGE"
  | "GARGANTUAN";
export type ApiAbility =
  | "Strength"
  | "Dexterity"
  | "Constitution"
  | "Intelligence"
  | "Wisdom"
  | "Charisma"
  | "Anything";
export const apiAbilityParser: Record<ApiAbility, Ability | "any"> = {
  Strength: "str",
  Dexterity: "dex",
  Constitution: "con",
  Intelligence: "int",
  Wisdom: "wis",
  Charisma: "cha",
  Anything: "any",
};
