import { ApiAbility, CreatureSize, Rarity } from "./Constants";

export interface ApiBaseObject {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBaseHombrewable extends ApiBaseObject {
  homebrewID: number | null;
}

export interface ApiBaseAncestry extends ApiBaseHombrewable {
  rarity: Rarity;
  hitPoints: number;
  size: CreatureSize;
  speed: number;
  visionSenseID: number | null;
  additionalSenseID: number | null;
  physicalFeatureOneID: number | null;
  physicalFeatureTwoID: number | null;
  tagID: number | null;
  artworkURL: string | null;
  isArchived: number;
  contentSrc: string | null;
  version: string;
}

export interface ApiBaseHeritage extends ApiBaseHombrewable {
  ancestryID: number | null;
  rarity: Rarity;
  code: string | null;
  isArchived: number;
  contentSrc: string | null;
  indivAncestryName: unknown | null;
}

export interface ApiBaseLanguage extends ApiBaseHombrewable {
  speakers: string;
  script: string;
}

export interface ApiBaseSense extends ApiBaseObject {
  isVisionType: number;
  visionPrecedence: number;
}

export interface ApiAncestry {
  ancestry: ApiBaseAncestry;
  heritages: ApiBaseHeritage[];
  languages: ApiBaseLanguage[];
  bonus_languages: ApiBaseLanguage[];
  boosts: ApiAbility[];
  flaws: ApiAbility[];
  vision_sense: ApiBaseSense;
  additional_sense: ApiBaseSense | null;
  physical_feature_one: unknown | null;
  physical_feature_two: unknown | null;
}

export interface ApiBaseTrait extends ApiBaseHombrewable {
  isImportant: number;
  isHidden: number;
  isArchived: number;
}

export interface ApiTrait {
  trait: ApiBaseTrait;
}

export interface ApiBaseCondition extends ApiBaseObject {
  hasValue: number;
  code: string | null;
}

export interface ApiCondition {
  condition: ApiBaseCondition;
}
