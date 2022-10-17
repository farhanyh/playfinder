import { Document, model, Schema, Types } from "mongoose";
import {
  Ability,
  isAbility,
  Modable,
  Proficiencies,
  SkillToAbility,
} from "../../typings/Character";
import { User } from "./user";

export interface CharacterInterface extends Document {
  user: Types.ObjectId;
  name: string;
  level: number;
  ancestry?: string;
  heritage?: string;
  background?: string;
  class?: string;
  keyAbility?: Ability;
  alignment?: string;
  gender?: string;
  age?: string;
  deity?: string;
  size: number;
  languages: string[];
  attributes?: {
    ancestryHp?: number;
    classHp?: number;
    bonusHp?: number;
    bonusHpPerLevel?: number;
    speed?: number;
    speedBonus?: number;
  };
  currentHp: number;
  maxHp: number;
  abilities?: Record<Ability, number>;
  proficiencies?: Proficiencies;
  lores?: { name: string; proficiency?: number; keyAbility?: Ability }[];
  feats?: { name: string; source?: string; level?: number }[];
  specials?: string[];
  equipment?: { name: string; qty?: number }[];
  specificProficiencies?: {
    trained?: string[];
    expert?: string[];
    master?: string[];
    legendary?: string[];
  };
  weapons?: {
    name?: string;
    qty?: number;
    prof?: "unarmed" | "simple" | "martial" | "advanced";
    die?: string;
    pot?: number;
    str?: string;
    mat?: string;
    display?: string;
    runes?: string[];
  }[];
  money?: { pp?: number; gp?: number; sp?: number; cp?: number };
  armor?: {
    name?: string;
    qty?: number;
    prof?: "unarmored" | "light" | "medium" | "heavy" | "shield";
    pot?: number;
    res?: string;
    mat?: string;
    display?: string;
    worn?: boolean;
    runes?: string[];
  }[];
  spellCasting?: {
    name: string;
    magicTradition?: "arcane" | "divine" | "occult" | "primal" | "focus";
    spellcastingType?: "prepared" | "spontaneous";
    ability?: "str" | "dex" | "con" | "int" | "wis" | "cha";
    proficiency?: number;
    focusPoints?: number;
    spells?: { spellLevel: number; list?: string[] }[];
    perDay?: number[];
  }[];
  formula?: string[];
  pets?: string[];
  ac?: {
    acProfBonus: number;
    acAbilityBonus: number;
    acItemBonus: number;
    acTotal: number;
  };
  avatar?: string;
}

export const CharacterSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  level: { type: Number, default: 1 },
  ancestry: String,
  heritage: String,
  background: String,
  class: String,
  keyAbility: String,
  alignment: String,
  gender: String,
  age: String,
  deity: String,
  size: { type: Number, default: 2 },
  languages: [String],
  attributes: {
    ancestryHp: { type: Number, default: 0 },
    classHp: { type: Number, default: 0 },
    bonusHp: { type: Number, default: 0 },
    bonusHpPerLevel: { type: Number, default: 0 },
    speed: { type: Number, default: 25 },
    speedBonus: { type: Number, default: 0 },
  },
  currentHp: { type: Number, default: 0 },
  maxHp: { type: Number, default: 0 },
  abilities: {
    str: { type: Number, default: 10 },
    dex: { type: Number, default: 10 },
    con: { type: Number, default: 10 },
    int: { type: Number, default: 10 },
    wis: { type: Number, default: 10 },
    cha: { type: Number, default: 10 },
  },
  proficiencies: {
    classDC: { type: Number, default: 0 },
    perception: { type: Number, default: 0 },
    fortitude: { type: Number, default: 0 },
    reflex: { type: Number, default: 0 },
    will: { type: Number, default: 0 },
    heavy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    light: { type: Number, default: 0 },
    unarmored: { type: Number, default: 0 },
    advanced: { type: Number, default: 0 },
    martial: { type: Number, default: 0 },
    simple: { type: Number, default: 0 },
    unarmed: { type: Number, default: 0 },
    castingArcane: { type: Number, default: 0 },
    castingDivine: { type: Number, default: 0 },
    castingOccult: { type: Number, default: 0 },
    castingPrimal: { type: Number, default: 0 },
    acrobatics: { type: Number, default: 0 },
    arcana: { type: Number, default: 0 },
    athletics: { type: Number, default: 0 },
    crafting: { type: Number, default: 0 },
    deception: { type: Number, default: 0 },
    diplomacy: { type: Number, default: 0 },
    intimidation: { type: Number, default: 0 },
    medicine: { type: Number, default: 0 },
    nature: { type: Number, default: 0 },
    occultism: { type: Number, default: 0 },
    performance: { type: Number, default: 0 },
    religion: { type: Number, default: 0 },
    society: { type: Number, default: 0 },
    stealth: { type: Number, default: 0 },
    survival: { type: Number, default: 0 },
    thievery: { type: Number, default: 0 },
  },
  lores: [
    {
      name: String,
      proficiency: { type: Number, default: 0 },
      keyAbility: { type: String, default: "int" },
    },
  ],
  feats: [{ name: String, source: String, level: Number }],
  specials: [String],
  equipment: [{ name: String, qty: Number }],
  specificProficiencies: {
    trained: [String],
    expert: [String],
    master: [String],
    legendary: [String],
  },
  weapons: [
    {
      name: String,
      qty: Number,
      prof: String,
      die: String,
      pot: Number,
      str: String,
      mat: String,
      display: String,
      runes: [String],
    },
  ],
  money: {
    pp: { type: Number, default: 0 },
    gp: { type: Number, default: 0 },
    sp: { type: Number, default: 0 },
    cp: { type: Number, default: 0 },
  },
  armor: [
    {
      name: String,
      qty: Number,
      prof: String,
      pot: Number,
      res: String,
      mat: String,
      display: String,
      worn: Boolean,
      runes: [String],
    },
  ],
  spellCasting: [
    {
      name: String,
      magicTradition: String,
      spellcastingType: String,
      ability: String,
      proficiency: Number,
      focusPoints: Number,
      spells: [{ spellLevel: Number, list: [String] }],
      perDay: [Number],
    },
  ],
  formula: [String],
  pets: [String],
  ac: {
    acProfBonus: { type: Number, default: 0 },
    acAbilityBonus: { type: Number, default: 0 },
    acItemBonus: { type: Number, default: 0 },
    acTotal: { type: Number, default: 10 },
  },
  avatar: String,
});

export class Character {
  static model = model<CharacterInterface>("character", CharacterSchema);
  private data?: (CharacterInterface & { _id: Types.ObjectId }) | null;

  private constructor(public id: Types.ObjectId) {}

  static createCharacter = async (id: Types.ObjectId): Promise<Character> => {
    const character = new Character(id);
    await character.cacheData();
    return character;
  };

  private cacheData = async (): Promise<void> => {
    const data = await Character.model.findById(this.id);
    this.data = data;
  };

  getData = async (): Promise<
    (CharacterInterface & { _id: Types.ObjectId }) | null
  > => {
    if (!this.data) await this.cacheData();
    return this.data!;
  };

  setData = async (
    data: Partial<CharacterInterface & { _id: Types.ObjectId }>
  ): Promise<void> => {
    await Character.model.findByIdAndUpdate(
      this.id,
      { $set: data },
      {
        upsert: true,
        new: true,
      }
    );
    await this.cacheData();
  };

  getSkillMod = async (skill: string): Promise<number> => {
    const data = await this.getData();
    if (!data) return 0;
    let prof = 0;
    let keyAbility: Ability | "none" = "none";
    if (data.proficiencies && skill in data.proficiencies) {
      prof = data.proficiencies[skill as keyof Proficiencies] || 0;
      const skillToAbility = await this.calculateSkillToAbility();
      keyAbility = skillToAbility[skill as keyof Proficiencies];
    } else if (data.lores) {
      const matchedLore = data.lores.find(
        (lore) => `${lore.name.toLowerCase()} lore` === skill.toLowerCase()
      );
      if (matchedLore) {
        prof = matchedLore.proficiency || 0;
        keyAbility = matchedLore.keyAbility || "int";
      }
    }
    return prof > 0
      ? prof + (await this.getAbilityMod(keyAbility)) + data.level
      : prof;
  };

  getAbilityMod = async (ability: Ability | "none"): Promise<number> => {
    const data = await this.getData();
    if (!data) return 0;
    if (ability === "none" || !data.abilities) return 0;
    return Math.floor((data.abilities[ability] - 10) / 2);
  };

  private calculateSkillToAbility = async (): Promise<SkillToAbility> => {
    const data = await this.getData();
    const skillToAbility: SkillToAbility = {
      classDC: data ? data.keyAbility || "none" : "none",
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

  getSkillsWithProf = async (): Promise<string[]> => {
    const data = await this.getData();
    if (!data || !data.proficiencies) return [];
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
      const prof = data.proficiencies![skill as keyof Proficiencies];
      if (!prof) return false;
      return true;
    });
    if (data.lores) {
      filteredSkills.push(
        ...data.lores.map((lore) => `${lore.name.toLowerCase()} lore`)
      );
      filteredSkills.sort();
    }
    return filteredSkills;
  };

  private calculateHp = (
    level: number,
    attributes?: {
      ancestryHp?: number;
      classHp?: number;
      bonusHp?: number;
      bonusHpPerLevel?: number;
    },
    conMod?: number
  ): number => {
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

  initCharacter = async () => {
    const character = await this.getData();
    if (character) {
      character.maxHp = this.calculateHp(
        character.level || 1,
        character.attributes,
        await this.getAbilityMod("con")
      );
      this.setData(character);
    }
  };

  static addData = async (user: User, name: string): Promise<Character> => {
    const userId = await user.getId();
    const document = await Character.model.create({ user: userId, name });
    return await Character.createCharacter(document._id);
  };

  static parsePathbuilderJSON = (
    json: any
  ): Partial<CharacterInterface & { _id: Types.ObjectId }> => {
    const {
      keyability,
      attributes,
      lores,
      feats,
      equipment,
      acTotal,
      spellCasters,
      ...rest
    } = json.build;
    return {
      keyAbility: keyability,
      attributes: {
        ancestryHp: attributes.ancestryhp,
        classHp: attributes.classhp,
        bonusHp: attributes.bonushp,
        bonusHpPerLevel: attributes.bonushpPerLevel,
        speed: attributes.speed,
        speedBonus: attributes.speedBonus,
      },
      lores: lores.map((lore: any) => ({
        name: lore[0] || undefined,
        proficiency: lore[1] || undefined,
      })),
      feats: feats.map((feat: any) => ({
        name: feat[0] || undefined,
        source: feat[2] || undefined,
        level: feat[3] || undefined,
      })),
      equipment: equipment.map((e: any) => ({
        name: e[0] || undefined,
        qty: e[1] || undefined,
      })),
      ac: acTotal,
      spellCasting: spellCasters,
      ...rest,
    };
  };
}

export default model<CharacterInterface>("character", CharacterSchema);
