import { Types } from "mongoose";
import Character, { CharacterInterface } from "../models/character";
import userController from "./userController";

export default {
  browse: async () => {
    return await Character.find();
  },
  read: async (id: Types.ObjectId) => {
    return await Character.findById(id);
  },
  edit: async (id: Types.ObjectId, data: Partial<CharacterInterface>) => {
    return await Character.findByIdAndUpdate(id, data);
  },
  add: async (data: Partial<CharacterInterface>) => {
    return await Character.create(data);
  },
  delete: async (id: Types.ObjectId) => {
    return await Character.findByIdAndRemove(id);
  },
  findByName: async (name: string) => {
    return await Character.findOne({ name });
  },
  findByUser: async (id: string) => {
    const user = await userController.findByDiscordId(id);
    if (!user) return [];
    return await Character.find({ user: user._id });
  },
  parsePathbuilderJSON: (json: any): Partial<CharacterInterface> => {
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
  },
};
