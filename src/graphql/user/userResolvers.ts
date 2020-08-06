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
import { UserDocument } from "../../mongodb/userModel";
import mongoose from "mongoose";

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
    whoToFollow: async (
      parent: any,
      args: any,
      { models: { userModel }, user }: Context
    ) => {
      const userDoc = await userModel.findById(user);

      // Gets 3 user documents that don't have the same ID as the logged in user
      const random = await userModel.aggregate<UserDocument>([
        { $match: { _id: { $ne: mongoose.Types.ObjectId(user) } } },
        { $sample: { size: 3 } },
      ]);

      // I'm probably doing something wrong, but the user documents returned from aggregate above
      // don't allow querying on 'id'... I couldn't figure it out so I just grabbed the _id fields
      // from the documents and did a regular 'find' operation to get the *same* list of documents,
      // but these ones allow querying on id...
      const ids: string[] = [];
      random.forEach((user) => ids.push(user._id.toString()));
      const randomDocs = await userModel.find({ _id: { $in: ids } });

      return randomDocs;
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
