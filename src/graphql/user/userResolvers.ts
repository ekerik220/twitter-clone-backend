import {
  MutationAddUserArgs,
  User,
} from "../../typescript/graphql-codegen-typings";
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
  Mutation: {
    addUser: async (
      parent: any,
      { email }: MutationAddUserArgs,
      { models: { userModel } }: Context
    ) => {
      const user: User = { email };
      const savedUser = await userModel.create(user);
      return savedUser;
    },
  },
};
