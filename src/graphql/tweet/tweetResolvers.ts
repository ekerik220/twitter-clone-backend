import {
  MutationAddTweetArgs,
  Tweet,
} from "../../typescript/graphql-codegen-typings";
import { Context } from "../../main";
import { ApolloError } from "apollo-server";
import { NOT_AUTHENICATED, DOCUMENT_NOT_FOUND } from "../../utils/errorCodes";

export const tweetResolvers = {
  Mutation: {
    addTweet: async (
      parent: any,
      { body }: MutationAddTweetArgs,
      { models: { userModel, tweetModel }, user }: Context
    ) => {
      // Check that we're logged in
      if (!user)
        throw new ApolloError(
          "Must be logged in to post a tweet.",
          NOT_AUTHENICATED
        );

      // Get the logged in user document
      const userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "No user matching given token.",
          DOCUMENT_NOT_FOUND
        );

      // Create a tweet object
      const tweet: Tweet = {
        userID: userDoc._id,
        username: userDoc.username,
        handle: userDoc.handle,
        avatar: userDoc.avatar,
        date: new Date(),
        body,
      };

      // Add the tweet object to Tweet collection
      const savedTweet = await tweetModel.create(tweet);

      // Add the id of the tweet to front of user's list of tweets
      userDoc.tweetIDs.unshift(savedTweet._id);
      userDoc.save();

      return savedTweet;
    },
  },
};
