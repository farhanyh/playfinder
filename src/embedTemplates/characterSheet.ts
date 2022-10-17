import { bold, EmbedBuilder } from "discord.js";
import { CharacterInterface } from "../database/models/character";
import {
  getAbilityMod,
  getSkillMod,
} from "../database/models/character/methods";
import { formatMod } from "../helper/formatMod";
import { titleCase } from "../helper/string";
import { Ability, Proficiencies } from "../typings/Character";
import { getSkillsWithProf } from "./../database/models/character/methods";

const characterSize = (size: number) => {
  const dictionary = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
  return dictionary[size];
};

const traitsFromAncestry = (ancestry?: string) => {
  if (typeof ancestry === "undefined") return [];
  return [ancestry];
};

export const characterSheetEmbed = (character: CharacterInterface) => {
  const traits: string[] = [
    character.alignment || "N",
    characterSize(character.size),
    ...traitsFromAncestry(character.ancestry),
  ];

  return new EmbedBuilder()
    .setTitle(character.name)
    .setThumbnail(character.avatar || null)
    .setDescription(
      [
        traits.map((trait) => bold(trait.toUpperCase())).join(" | "),
        `${character.gender} ${character.ancestry} ${character.class} ${character.level}`,
        `${bold("Perception")} ${formatMod(
          getSkillMod(character, "perception")
        )}`,
        `${bold("Languages")} ${character.languages.join(", ")}`,
        `${bold("Skills")} ${getSkillsWithProf(character)
          .map(
            (skill) =>
              `${titleCase(skill)} ${formatMod(
                getSkillMod(character, skill as keyof Proficiencies)
              )}`
          )
          .join(", ")}`,
        character.abilities
          ? Object.keys(character.abilities)
              .map(
                (key) =>
                  `${bold(titleCase(key))} ${formatMod(
                    getAbilityMod(character.abilities, key as Ability)
                  )}`
              )
              .join(", ")
          : "",
        `${bold("AC")} ${
          character.ac
            ? character.ac.acTotal
            : 10 + getAbilityMod(character.abilities, "dex")
        }; ${bold("Fort")} ${formatMod(
          getSkillMod(character, "fortitude")
        )}, ${bold("Ref")} ${formatMod(
          getSkillMod(character, "reflex")
        )}, ${bold("Will")} ${formatMod(getSkillMod(character, "will"))}`,
        `${bold("HP")} ${character.currentHp}/${character.maxHp}`,
        `${bold("Speed")} ${
          character.attributes
            ? (character.attributes.speed || 25) +
              (character.attributes.speedBonus || 0)
            : 25
        } feet`,
      ].join("\n")
    )
    .setFooter({
      text: "To change active characters, use `/character set`",
    });
};
