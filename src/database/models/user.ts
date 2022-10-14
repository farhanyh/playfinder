import { Document, model, Schema, Types } from "mongoose";

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

export default model<UserInterface>("User", UserSchema);
