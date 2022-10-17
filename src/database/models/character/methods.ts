import { Types } from "mongoose";
import {
  Ability,
  Proficiencies,
  SkillToAbility,
} from "../../../typings/Character";
import { CharacterInterface } from "./index";

export const getSkillMod = (character: CharacterInterface, skill: string) => {
  let prof = 0;
  let keyAbility: Ability | "none" = "none";
  if (character.proficiencies && skill in character.proficiencies) {
    prof = character.proficiencies[skill as keyof Proficiencies] || 0;
    const skillToAbility = calculateSkillToAbility(character);
    keyAbility = skillToAbility[skill as keyof Proficiencies];
  } else if (character.lores) {
    const matchedLore = character.lores.find(
      (lore) => `${lore.name.toLowerCase()} lore` === skill.toLowerCase()
    );
    if (matchedLore) {
      prof = matchedLore.proficiency || 0;
      keyAbility = matchedLore.keyAbility || "int";
    }
  }
  return prof > 0
    ? prof + getAbilityMod(character.abilities, keyAbility) + character.level
    : prof;
};

export const getSkillsWithProf = (character: CharacterInterface) => {
  if (!character.proficiencies) return [];
  const skills = [
    "acrobatics",
    "arcana",
    "athletics",
    "crafting",
    "deception",
    "diplomacy",
    "intimidation",
    "medicine",
    "nature",
    "occultism",
    "performance",
    "religion",
    "society",
    "stealth",
    "survival",
    "thievery",
  ];
  const filteredSkills = skills.filter((skill) => {
    const prof = character.proficiencies![skill as keyof Proficiencies];
    if (!prof) return false;
    return true;
  });
  if (character.lores) {
    filteredSkills.push(
      ...character.lores.map((lore) => `${lore.name.toLowerCase()} lore`)
    );
    filteredSkills.sort();
  }
  return filteredSkills;
};

export const getAbilityMod = (
  abilities: Record<Ability, number> | undefined,
  ability: Ability | "none"
) => {
  if (ability === "none" || !abilities) return 0;
  return Math.floor((abilities[ability] - 10) / 2);
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

export const calculateHp = (
  level: number,
  attributes?: {
    ancestryHp?: number;
    classHp?: number;
    bonusHp?: number;
    bonusHpPerLevel?: number;
  },
  conMod?: number
) => {
  if (attributes) {
    const { ancestryHp, classHp, bonusHp, bonusHpPerLevel } = attributes;
    return (
      ((classHp || 0) + (bonusHpPerLevel || 0) + (conMod || 0)) * level +
      (ancestryHp || 0) +
      (bonusHp || 0)
    );
  }
  return 0;
};

export const initCharacter = (
  character: Partial<CharacterInterface & { _id: Types.ObjectId }>
) => {
  character.maxHp = calculateHp(
    character.level || 1,
    character.attributes,
    getAbilityMod(character.abilities, "con")
  );
  return character;
};
