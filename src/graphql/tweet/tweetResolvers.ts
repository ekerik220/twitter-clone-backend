import {
  MutationAddTweetArgs,
  Tweet,
  MutationAddOrRemoveLikeArgs,
  QueryTweetArgs,
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
        likeIDs: [],
      };

      // Add the tweet object to Tweet collection
      const savedTweet = await tweetModel.create(tweet);

      // Add the id of the tweet to front of user's list of tweets
      userDoc.tweetIDs.unshift(savedTweet._id);
      userDoc.save();

      return savedTweet;
    },
    addOrRemoveLike: async (
      parent: any,
      { tweet }: MutationAddOrRemoveLikeArgs,
      { models: { tweetModel }, user }: Context
    ) => {
      // Check the user is logged in
      if (!user)
        throw new ApolloError(
          "Must be logged in to like a tweet.",
          NOT_AUTHENICATED
        );

      // Get tweet from DB
      const tweetDoc = await tweetModel.findById(tweet);
      if (!tweetDoc)
        throw new ApolloError("Tweet does not exist", DOCUMENT_NOT_FOUND);

      // If user ID exists in likes, remove it
      const index = tweetDoc.likeIDs.indexOf(user);
      if (index > -1) tweetDoc.likeIDs.splice(index, 1);
      else tweetDoc.likeIDs.push(user);

      // Save changes
      const savedDoc = await tweetDoc.save();

      // Return new like list
      return savedDoc.likeIDs;
    },
  },
  Query: {
    tweet: async (
      parent: any,
      { id }: QueryTweetArgs,
      { models: { tweetModel } }: Context
    ) => {
      // Find the tweet by ID
      const tweet = await tweetModel.findById(id);
      if (!tweet)
        throw new ApolloError("No tweet with given ID.", DOCUMENT_NOT_FOUND);

      // return the tweet
      return tweet;
    },
  },
};
