import {
  Ability,
  Proficiencies,
  SkillToAbility,
} from "../../../typings/Character";
import { CharacterInterface } from "./index";

export const getSkillMod = (
  character: CharacterInterface,
  skill: keyof Proficiencies
) => {
  if (!character.proficiencies) return 0;
  const prof = character.proficiencies[skill] || 0;
  const skillToAbility = calculateSkillToAbility(character);
  return prof > 0
    ? prof + getAbilityMod(character, skillToAbility[skill]) + character.level
    : prof;
};

export const getAbilityMod = (
  character: CharacterInterface,
  ability: Ability | "none"
) => {
  if (ability === "none" || !character.abilities) return 0;
  return Math.floor((character.abilities[ability] - 10) / 2);
};

export const calculateSkillToAbility = (character: CharacterInterface) => {
  const skillToAbility: SkillToAbility = {
    classDC: character.keyAbility || "none",
    perception: "wis",
    fortitude: "con",
    reflex: "dex",
    will: "wis",
    heavy: "none",
    medium: "none",
    light: "none",
    unarmored: "none",
    advanced: "none",
    martial: "none",
    simple: "none",
    unarmed: "none",
    castingArcane: "none",
    castingDivine: "none",
    castingOccult: "none",
    castingPrimal: "none",
    acrobatics: "dex",
    arcana: "int",
    athletics: "str",
    crafting: "int",
    deception: "cha",
    diplomacy: "cha",
    intimidation: "cha",
    medicine: "wis",
    nature: "wis",
    occultism: "int",
    performance: "cha",
    religion: "wis",
    society: "int",
    stealth: "dex",
    survival: "wis",
    thievery: "dex",
  };
  return skillToAbility;
};
