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
  private data?: UserInterface & { _id: Types.ObjectId };

  private constructor(public discordId: string, private id?: Types.ObjectId) {}

  static createUser = async (
    discordId: string,
    id?: Types.ObjectId
  ): Promise<User> => {
    const user = new User(discordId, id);
    await user.cacheData();
    return user;
  };

  private cacheData = async (): Promise<void> => {
    const data =
      (this.id
        ? await User.model.findById(this.id)
        : await User.model.findOne({ discordId: this.discordId })) ||
      (await User.model.create({ discordId: this.discordId }));

    this.data = data;
    if (!this.id) this.id = data._id;
  };

  getId = async (): Promise<Types.ObjectId> => {
    return this.id || (await this.getData())._id;
  };

  getData = async (): Promise<UserInterface & { _id: Types.ObjectId }> => {
    if (!this.data) await this.cacheData();
    return this.data!;
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
    await this.cacheData();
  };

  getActiveCharacter = async (): Promise<Character | null> => {
    const activeCharacterId = (await this.getData()).activeCharacter;
    if (!activeCharacterId) return null;
    return await Character.createCharacter(activeCharacterId);
  };

  getCharacters = async (): Promise<Character[]> => {
    return await Promise.all(
      (
        await this.getData()
      ).characters.map(
        async (characterId) => await Character.createCharacter(characterId)
      )
    );
  };

  getCharacterByName = async (name: string): Promise<Character | null> => {
    const character = await Character.model.findOne({
      user: await this.getId(),
      name,
    });
    if (!character) return null;
    return await Character.createCharacter(character._id);
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
      await newCharacter.initCharacter();
    }
    return newCharacter;
  };
}
