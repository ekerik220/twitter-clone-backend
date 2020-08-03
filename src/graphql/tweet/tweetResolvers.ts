import {
  MutationAddTweetArgs,
  Tweet,
  MutationAddOrRemoveLikeArgs,
  QueryTweetArgs,
  MutationAddCommentArgs,
  MutationAddRetweetArgs,
  MutationUndoRetweetArgs,
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
        commentIDs: [],
        retweetIDs: [],
      };

      // Add the tweet object to Tweet collection
      const savedTweet = await tweetModel.create(tweet);

      // Add the id of the tweet to front of user's list of tweets
      userDoc.tweetIDs.unshift(savedTweet._id);
      userDoc.save();

      return savedTweet;
    },
    addComment: async (
      parent: any,
      { replyingToID, body }: MutationAddCommentArgs,
      { models: { tweetModel, userModel }, user }: Context
    ) => {
      // Get the tweet we're replying to
      const parentTweet = await tweetModel.findById(replyingToID);
      if (!parentTweet)
        throw new ApolloError(
          "The tweet you're commenting on does not exist.",
          DOCUMENT_NOT_FOUND
        );

      // Get the user that's making this comment
      const userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "Must be logged in to comment.",
          NOT_AUTHENICATED
        );

      // Make a tweet object (comment)
      const comment: Tweet = {
        userID: userDoc._id,
        username: userDoc.username,
        handle: userDoc.handle,
        avatar: userDoc.avatar,
        date: new Date(),
        body,
        likeIDs: [],
        commentIDs: [],
        retweetIDs: [],
        replyingTo: parentTweet.handle,
      };

      // Add comment to tweet DB
      const commentDoc = await tweetModel.create(comment);

      // Add comment ID to the parentTweet's comment list
      parentTweet.commentIDs.push(commentDoc.id);
      parentTweet.save();

      // Add comment ID to user's tweet list
      userDoc.tweetIDs.push(commentDoc.id);
      userDoc.save();

      // return comment
      return commentDoc;
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
    addRetweet: async (
      parent: any,
      { parentID, body }: MutationAddRetweetArgs,
      { models: { tweetModel, userModel }, user }: Context
    ) => {
      // Get parent tweet
      const parentTweet = await tweetModel.findById(parentID);
      if (!parentTweet)
        throw new ApolloError(
          "The tweet you're trying to retweet does not exist.",
          DOCUMENT_NOT_FOUND
        );

      // Get logged in user
      const userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "Must be logged in to retweet.",
          NOT_AUTHENICATED
        );

      // Create tweet object
      const tweet: Tweet = {
        userID: userDoc._id,
        username: userDoc.username,
        handle: userDoc.handle,
        avatar: userDoc.avatar,
        date: new Date(),
        body,
        likeIDs: [],
        commentIDs: [],
        retweetIDs: [],
        retweetParent: parentID,
      };

      // Add the tweet to the DB
      const savedTweet = await tweetModel.create(tweet);

      // Add the ID of the tweet to user's retweet list
      // and add the parentID to user's retweetParentID list
      userDoc.retweetIDs.push(savedTweet.id);
      if (!body) userDoc.retweetParentIDs.push(parentID);
      userDoc.save();

      // Add the ID of the tweet to the parent's retweet ID list
      parentTweet.retweetIDs.push(savedTweet.id);
      parentTweet.save();

      // return the new tweet
      return savedTweet;
    },
    undoRetweet: async (
      parent: any,
      { parentID }: MutationUndoRetweetArgs,
      { models: { tweetModel, userModel }, user }: Context
    ) => {
      // Get the parent tweet
      const parentTweet = await tweetModel.findById(parentID);
      if (!parentTweet)
        throw new ApolloError(
          "Parent tweet does not exist.",
          DOCUMENT_NOT_FOUND
        );

      // Get the logged in user
      const userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "Must be logged in to remove a retweet.",
          NOT_AUTHENICATED
        );

      // Find a document in parent tweets retweet list with userID matching logged in
      // user AND no body field
      const retweet = await tweetModel.findOne({
        $and: [
          { _id: { $in: parentTweet.retweetIDs } },
          { userID: user },
          { body: null },
        ],
      });
      if (!retweet)
        throw new ApolloError(
          "Retweet by this user on this tweet does not exist.",
          DOCUMENT_NOT_FOUND
        );

      // Remove this retweet from parent tweets retweetIDs
      let deleteIndex = parentTweet.retweetIDs.indexOf(retweet.id);
      if (deleteIndex > -1) {
        parentTweet.retweetIDs.splice(deleteIndex, 1);
        parentTweet.save();
      }

      // Remove this retweet from user's retweetIDs
      deleteIndex = userDoc.retweetIDs.indexOf(retweet.id);
      if (deleteIndex > -1) {
        userDoc.retweetIDs.splice(deleteIndex, 1);
      }

      // Remove this parent tweet from user's retweetParentIDs
      deleteIndex = userDoc.retweetParentIDs.indexOf(parentID);
      if (deleteIndex > -1) {
        userDoc.retweetParentIDs.splice(deleteIndex, 1);
      }
      userDoc.save();

      // Remove the retweet from the tweets DB as it's not longer being used
      tweetModel.findByIdAndRemove(retweet.id);

      // return the removed retweet document so front end can make local updates
      return retweet;
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
  Tweet: {
    comments: async (
      parent: Tweet,
      args: any,
      { models: { tweetModel } }: Context
    ) => {
      // Get all the comment documents using parent's commentIDs array
      const comments = await tweetModel.find({
        _id: { $in: parent.commentIDs },
      });

      // Sort the comments by their date
      comments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return comments;
    },
  },
};
