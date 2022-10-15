import { bold, EmbedBuilder } from "discord.js";
import { CharacterInterface } from "../database/models/character";
import { getSkillMod } from "../database/models/character/methods";
import { formatMod } from "../helper/formatMod";

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
      ].join("\n")
    )
    .setFooter({
      text: "To change active characters, use `/character <name>`",
    });
};
