import { Context } from "../../main";

export const userResolvers = {
  Query: {
    users: async (
      parent: any,
      args: any,
      { models: { userModel } }: Context
    ) => {
      const users = await userModel.find();
      return users;
    },
  },
};
