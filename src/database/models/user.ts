import { Document, model, Schema, Types, UpdateQuery } from "mongoose";

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

  constructor(public discordId: string, public id?: Types.ObjectId) {}

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
}

export default model<UserInterface>("User", UserSchema);
