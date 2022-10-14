import User, { UserInterface } from "../models/user";

export default {
  browse: async () => {
    return await User.find();
  },
  read: async (id: string) => {
    return await User.findOne({ discordId: id });
  },
  edit: async (id: string, data: Partial<UserInterface>) => {
    return await User.findOneAndUpdate({ discordId: id }, data);
  },
  add: async (data: Partial<UserInterface>) => {
    return await User.create(data);
  },
  delete: async (id: string) => {
    return await User.findOneAndRemove({ discordId: id });
  },
};
