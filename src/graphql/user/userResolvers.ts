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
  Mutation: {
    setAvatarImage: async (
      parent: any,
      { file }: MutationSetAvatarImageArgs,
      { models: { userModel }, user }: Context
    ) => {
      const uploadUrl = await processUpload(file);
      const self = await userModel.findById(user);

      if (!self)
        throw new ApolloError("Couldn't find user.", DOCUMENT_NOT_FOUND);

      self.avatar = uploadUrl;
      const saved = await self.save();

      return saved;
    },
  },
};

const processUpload = async (upload: any) => {
  const { stream } = await upload;

  let resultUrl = "";
  const cloudinaryUpload = async (stream: any) => {
    try {
      await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream(function (
          error,
          result
        ) {
          if (result) {
            resultUrl = result.secure_url;
            resolve(resultUrl);
          } else {
            reject(error);
          }
        });

        stream.pipe(streamLoad);
      });
    } catch (err) {
      throw new Error(`Failed to upload picture ! Err:${err.message}`);
    }
  };

  await cloudinaryUpload(stream);
  return resultUrl;
};
