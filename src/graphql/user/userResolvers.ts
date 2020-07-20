import { Context } from "../../main";
import {
  QueryEmailTakenArgs,
  QueryUsernameTakenArgs,
} from "../../typescript/graphql-codegen-typings";

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
    // * Checks if a user exists with given email.
    emailTaken: async (
      parent: any,
      { email }: QueryEmailTakenArgs,
      { models: { userModel } }: Context
    ) => {
      const exists = await userModel.exists({ email });
      return exists;
    },
    usernameTaken: async (
      parent: any,
      { username }: QueryUsernameTakenArgs,
      { models: { userModel } }: Context
    ) => {
      const exists = await userModel.exists({ username });
      return exists;
    },
  },
};
