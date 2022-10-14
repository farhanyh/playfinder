import { Types } from "mongoose";
import User, { UserInterface } from "../models/user";

export default {
  browse: async () => {
    return await User.find();
  },
  read: async (id: Types.ObjectId) => {
    return await User.findById(id);
  },
  findByDiscordId: async (id: string) => {
    return await User.findOne({ discordId: id });
  },
  edit: async (id: Types.ObjectId, data: Partial<UserInterface>) => {
    return await User.findByIdAndUpdate(id, data);
  },
  editByDiscordId: async (id: string, data: Partial<UserInterface>) => {
    return await User.findOneAndUpdate({ discordId: id }, data);
  },
  add: async (data: Partial<UserInterface>) => {
    return await User.create(data);
  },
  deleteByDiscordId: async (id: string) => {
    return await User.findOneAndRemove({ discordId: id });
  },
  delete: async (id: Types.ObjectId) => {
    return await User.findByIdAndRemove(id);
  },
};
