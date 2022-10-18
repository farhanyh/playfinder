import { ApiAbility, CreatureSize, Rarity } from "./Constants";

export interface Ancestry {
  wgId: number;
  name: string;
  rarity: Rarity;
  hitPoints: number;
  size: CreatureSize;
  speed: number;
  description?: string;
  visionSenseID?: number;
  additionalSenseID?: number;
  physicalFeatureID: number[];
  tagID?: number;
  artworkURL?: string;
  isArchived: number;
  contentSrc?: string;
  homebrewID?: number;
  heritages: number[];
  languages: string[];
  bonusLanguages: number[];
  boosts: ApiAbility[];
  flaws: ApiAbility[];
}
