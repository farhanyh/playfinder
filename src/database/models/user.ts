import { Document, model, Schema, Types } from "mongoose";
import { Character, CharacterInterface } from "./character";

export interface UserInterface extends Document {
  discordId: string;
  avatar?: string;
  username?: string;
  discriminator?: string;
  characters: Types.ObjectId[];
  activeCharacter?: Types.ObjectId;
}

export const UserSchema = new Schema({
  discordId: String,
  avatar: String,
  username: String,
  discriminator: String,
  characters: {
    type: [{ type: Schema.Types.ObjectId, ref: "Character" }],
    default: [],
  },
  activeCharacter: {
    type: Schema.Types.ObjectId,
    ref: "Character",
  },
});

export class User {
  static model = model<UserInterface>("User", UserSchema);

  constructor(public discordId: string, private id?: Types.ObjectId) {}

  getId = async (): Promise<Types.ObjectId> => {
    return this.id || (await this.getData())._id;
  };

  getData = async (): Promise<UserInterface & { _id: Types.ObjectId }> => {
    const data =
      (this.id
        ? await User.model.findById(this.id)
        : await User.model.findOne({ discordId: this.discordId })) ||
      (await User.model.create({ discordId: this.discordId }));
    if (!this.id) this.id = data._id;
    return data;
  };

  setData = async (
    data: Partial<UserInterface & { _id: Types.ObjectId }>
  ): Promise<void> => {
    const result = this.id
      ? await User.model.findByIdAndUpdate(
          this.id,
          { $set: data },
          {
            upsert: true,
            new: true,
          }
        )
      : await User.model.findOneAndUpdate(
          { discordId: this.discordId },
          { $set: data },
          {
            upsert: true,
            new: true,
          }
        );
    if (result && !this.id) this.id = result._id;
  };

  getActiveCharacter = async (): Promise<Character | null> => {
    const activeCharacterId = (await this.getData()).activeCharacter;
    if (!activeCharacterId) return null;
    return new Character(activeCharacterId);
  };

  getCharacters = async (): Promise<Character[]> => {
    return (await this.getData()).characters.map(
      (characterId) => new Character(characterId)
    );
  };

  getCharacterByName = async (name: string): Promise<Character | null> => {
    const character = await Character.model.findOne({
      user: await this.getId(),
      name,
    });
    if (!character) return null;
    return new Character(character._id);
  };

  upsertCharacter = async (
    data: Partial<CharacterInterface & { _id: Types.ObjectId }>
  ): Promise<Character | null> => {
    const name = data.name || "Unknown Adventurer";
    const character = await this.getCharacterByName(name);
    if (character) await character.setData(data);
    else
      await (
        await Character.addData(this, name)
      ).setData({ ...data, currentHp: data.maxHp });
    const newCharacter = await this.getCharacterByName(name);
    if (newCharacter) {
      const userCharacters = (await this.getData()).characters;
      this.setData({
        characters: userCharacters.filter(
          (value, index, self) =>
            self.findIndex((v) => v.toString() === value.toString()) === index
        ),
        activeCharacter: newCharacter.id,
      });
    }
    return newCharacter;
  };
}
