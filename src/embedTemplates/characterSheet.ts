import { bold, EmbedBuilder } from "discord.js";
import { Character } from "../database/models/character";
import { formatMod } from "../helper/formatMod";
import { titleCase } from "../helper/string";
import { Ability, Proficiencies } from "../typings/Character";
import { errorEmbed } from "./error";

const characterSize = (size: number) => {
  const dictionary = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
  return dictionary[size];
};

const traitsFromAncestry = (ancestry?: string) => {
  if (typeof ancestry === "undefined") return [];
  return [ancestry];
};

export const characterSheetEmbed = (character: Character) => {
  try {
    const characterData = character.getData();
    const traits: string[] = [
      characterData.alignment || "N",
      characterSize(characterData.size),
      ...traitsFromAncestry(characterData.ancestry),
    ];

    return new EmbedBuilder()
      .setTitle(characterData.name)
      .setThumbnail(characterData.avatar || null)
      .setDescription(
        [
          traits.map((trait) => bold(trait.toUpperCase())).join(" | "),
          `${characterData.gender} ${characterData.ancestry} ${characterData.class} ${characterData.level}`,
          `${bold("Perception")} ${formatMod(
            character.getSkillMod("perception")
          )}`,
          `${bold("Languages")} ${characterData.languages.join(", ")}`,
          `${bold("Skills")} ${character
            .getSkillsWithProf()
            .map(
              (skill) =>
                `${titleCase(skill)} ${formatMod(
                  character.getSkillMod(skill as keyof Proficiencies)
                )}`
            )
            .join(", ")}`,
          characterData.abilities
            ? Object.keys(characterData.abilities)
                .map(
                  (key) =>
                    `${bold(titleCase(key))} ${formatMod(
                      character.getAbilityMod(key as Ability)
                    )}`
                )
                .join(", ")
            : "",
          `${bold("AC")} ${
            characterData.ac
              ? characterData.ac.acTotal
              : 10 + character.getAbilityMod("dex")
          }; ${bold("Fort")} ${formatMod(
            character.getSkillMod("fortitude")
          )}, ${bold("Ref")} ${formatMod(
            character.getSkillMod("reflex")
          )}, ${bold("Will")} ${formatMod(character.getSkillMod("will"))}`,
          `${bold("HP")} ${characterData.currentHp}/${characterData.maxHp}`,
          `${bold("Speed")} ${
            characterData.attributes
              ? (characterData.attributes.speed || 25) +
                (characterData.attributes.speedBonus || 0)
              : 25
          } feet`,
        ].join("\n")
      )
      .setFooter({
        text: "To change active characters, use `/character set`",
      });
  } catch (error) {
    return errorEmbed((error as Error).message);
  }
};
