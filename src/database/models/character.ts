import { Document, model, Schema, Types } from "mongoose";

export interface CharacterInterface extends Document {
  user: Types.ObjectId;
  name: string;
  level: number;
  ancestry?: string;
  heritage?: string;
  background?: string;
  class?: string;
  keyAbility?: "str" | "dex" | "con" | "int" | "wis" | "cha";
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
  abilities?: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
  };
  proficiencies?: {
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
  };
  lores?: { name: string; proficiency?: number }[];
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
  lores: [{ name: String, proficiency: { type: Number, default: 0 } }],
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

export default model<CharacterInterface>("character", CharacterSchema);