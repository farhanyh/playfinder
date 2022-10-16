import { Types } from "mongoose";
import User, { UserInterface } from "../models/user";

const browse = async () => {
  return await User.find();
};
const read = async (id: Types.ObjectId) => {
  return await User.findById(id);
};
const findByDiscordId = async (id: string) => {
  return await User.findOne({ discordId: id });
};
const edit = async (id: Types.ObjectId, data: Partial<UserInterface>) => {
  return await User.findByIdAndUpdate(id, data);
};
const editByDiscordId = async (id: string, data: Partial<UserInterface>) => {
  return await User.findOneAndUpdate({ discordId: id }, data);
};
const add = async (data: Partial<UserInterface>) => {
  return await User.create(data);
};
const deleteByDiscordId = async (id: string) => {
  return await User.findOneAndRemove({ discordId: id });
};
const del = async (id: Types.ObjectId) => {
  return await User.findByIdAndRemove(id);
};
const hasActiveCharacter = async (id: string | Types.ObjectId) => {
  const user =
    typeof id === "string" ? await findByDiscordId(id) : await read(id);
  return !!user && !!user.activeCharacter;
};
export default {
  browse,
  read,
  findByDiscordId,
  edit,
  editByDiscordId,
  add,
  deleteByDiscordId,
  delete: del,
  hasActiveCharacter,
};
