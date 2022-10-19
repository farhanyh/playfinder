import axios from "axios";
import config from "../config";
import { Ancestry } from "../typings/Ancestry";
import { ApiAncestry, ApiCondition, ApiTrait } from "../typings/api";
import { Condition } from "../typings/Condition";
import { Trait } from "../typings/Trait";

const client = axios.create({
  baseURL: config.WG_BASE_URL,
  headers: {
    Authorization: `Apikey ${config.WG_API_KEY}`,
  },
});

export const getAncestry = async (ancestry: string): Promise<Ancestry> => {
  const { data } = await client.get<ApiAncestry>("ancestry", {
    params: { name: ancestry },
  });
  return {
    wgId: data.ancestry.id,
    name: data.ancestry.name,
    rarity: data.ancestry.rarity,
    hitPoints: data.ancestry.hitPoints,
    size: data.ancestry.size,
    speed: data.ancestry.speed,
    description: data.ancestry.description,
    visionSenseID: data.ancestry.visionSenseID || undefined,
    additionalSenseID: data.ancestry.additionalSenseID || undefined,
    physicalFeatureID: [
      data.ancestry.physicalFeatureOneID,
      data.ancestry.physicalFeatureTwoID,
    ].filter((id) => id !== null) as number[],
    tagID: data.ancestry.tagID || undefined,
    artworkURL: data.ancestry.artworkURL || undefined,
    isArchived: data.ancestry.isArchived,
    contentSrc: data.ancestry.contentSrc || undefined,
    homebrewID: data.ancestry.homebrewID || undefined,
    heritages: data.heritages.map((heritage) => heritage.id),
    languages: data.languages.map((language) => language.name),
    bonusLanguages: data.bonus_languages.map((language) => language.id),
    boosts: data.boosts,
    flaws: data.flaws,
  };
};

export const getTraitById = async (id: number): Promise<Trait> => {
  const { data } = await client.get<ApiTrait>("trait", {
    params: { id },
  });
  const { trait } = data;
  return {
    wgId: trait.id,
    name: trait.name,
    description: trait.description,
    isImportant: trait.isImportant,
    isHidden: trait.isHidden,
    isArchived: trait.isArchived,
    homebrewID: trait.homebrewID || undefined,
  };
};

export const getCondition = async (name: string): Promise<Condition> => {
  const { data } = await client.get<ApiCondition>("condition", {
    params: { name },
  });
  const { condition } = data;
  return condition;
};
