import { Context } from "../../main";
import {
  QueryEmailTakenArgs,
  QueryUsernameTakenArgs,
  MutationSetAvatarImageArgs,
  User,
  UserTweetsArgs,
} from "../../typescript/graphql-codegen-typings";
import cloudinary from "cloudinary";
import { ApolloError } from "apollo-server";
import { DOCUMENT_NOT_FOUND } from "../../utils/errorCodes";
import Tweet from "../../mongodb/tweetModel";

export const userResolvers = {
  Query: {
    self: async (
      parent: any,
      args: any,
      { models: { userModel }, user }: Context
    ) => {
      const self = await userModel.findById(user);

      if (!self) throw new ApolloError("User not found.", DOCUMENT_NOT_FOUND);

      return self;
    },
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
  User: {
    tweets: async (
      parent: User,
      { getRetweets }: UserTweetsArgs,
      { models: { tweetModel } }: Context
    ) => {
      // Get user's tweets
      const tweetIDs = parent.tweetIDs;
      let tweets = await tweetModel.find({ _id: { $in: tweetIDs } });

      // If getRetweets flag is set, get user's retweets as well
      if (getRetweets) {
        const retweetIDs = parent.retweetIDs;
        const retweets = await tweetModel.find({ _id: { $in: retweetIDs } });
        tweets = [...tweets, ...retweets];
      }

      // Sort tweets by date
      tweets.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return tweets;
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
