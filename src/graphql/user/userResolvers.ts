import { Context } from "../../main";
import {
  QueryEmailTakenArgs,
  QueryUsernameTakenArgs,
  MutationSetAvatarImageArgs,
  User,
  MutationFollowOrUnfollowArgs,
  MutationAddOrRemoveBookmarkArgs,
  Notification,
  QuerySearchUsersArgs,
  QueryGetUserByHandleArgs,
  MutationUpdateProfileArgs,
} from "../../typescript/graphql-codegen-typings";
import cloudinary from "cloudinary";
import { ApolloError } from "apollo-server";
import { DOCUMENT_NOT_FOUND, NOT_AUTHENICATED } from "../../utils/errorCodes";
import { UserDocument } from "../../mongodb/userModel";
import mongoose from "mongoose";
import { processUpload } from "../../utils/processUpload";

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

      const followingIDs = userDoc?.followingIDs.map((id) =>
        mongoose.Types.ObjectId(id as string)
      );

      // Gets 3 user documents that don't have the same ID as the logged in user
      const random = await userModel.aggregate<UserDocument>([
        {
          $match: {
            $and: [
              { _id: { $ne: mongoose.Types.ObjectId(user) } },
              { _id: { $nin: followingIDs } },
            ],
          },
        },
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
    searchUsers: async (
      parent: any,
      { term }: QuerySearchUsersArgs,
      { models: { userModel } }: Context
    ) => {
      const users = await userModel.find({
        $or: [
          { username: { $regex: `.*${term}.*`, $options: "i" } },
          { handle: { $regex: `.*${term}.*`, $options: "i" } },
        ],
      });

      return users;
    },
    getUserByHandle: async (
      parent: any,
      { handle }: QueryGetUserByHandleArgs,
      { models: { userModel } }: Context
    ) => {
      const user = await userModel.findOne({ handle });
      return user;
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
    followOrUnfollow: async (
      parent: any,
      { id }: MutationFollowOrUnfollowArgs,
      { models: { userModel }, user }: Context
    ) => {
      // Get the logged in user
      let userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "Must be signed in to follow somone.",
          NOT_AUTHENICATED
        );

      // If already following this id, perform unfollow tasks...
      if (userDoc.followingIDs.includes(id)) {
        // Followed user: remove our ID from their followedBy list, and remove the notification
        // that we followed them from their notifications.
        await userModel.findByIdAndUpdate(id, {
          $pull: {
            followedByIDs: userDoc.id,
            notifications: { notifierID: userDoc.id, type: "follow" },
          },
        });

        // Current user: remove all notifications from the user we unfollowed, and remove
        // their ID from our followingIDs list.
        userDoc = await userModel.findByIdAndUpdate(
          user,
          {
            $pull: { notifications: { notifierID: id }, followingIDs: id },
          },
          { new: true }
        );
      }
      // perform follow tasks...
      else {
        // make a notification object
        const notification: Notification = {
          type: "follow",
          user: userDoc,
          notifierID: userDoc.id,
        };

        // add notification to followed user saying that we followed them, and add ourselves
        // to their followedBy list
        await userModel.findByIdAndUpdate(id, {
          $push: {
            notifications: { $each: [notification], $position: 0 },
            followedByIDs: userDoc.id,
          },
        });

        // add follow target's ID to our followingIDs list
        userDoc = await userModel.findByIdAndUpdate(
          user,
          {
            $push: { followingIDs: id },
          },
          { new: true }
        );
      }

      return userDoc;
    },
    addOrRemoveBookmark: async (
      parent: any,
      { tweetID }: MutationAddOrRemoveBookmarkArgs,
      { models: { userModel }, user }: Context
    ) => {
      const userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "Must be signed in to add a bookmark.",
          NOT_AUTHENICATED
        );

      // If already following this id, remove from followingIDs (unfollow)
      if (userDoc.bookmarkIDs.includes(tweetID)) {
        const deleteIndex = userDoc.bookmarkIDs.indexOf(tweetID);
        userDoc.bookmarkIDs.splice(deleteIndex, 1);
      }
      // else, add to followingIDs (follow)
      else {
        userDoc.bookmarkIDs.push(tweetID);
      }

      const savedUser = await userDoc.save();

      return savedUser;
    },
    updateProfile: async (
      parent: any,
      { username, bio, avatar, profileImg }: MutationUpdateProfileArgs,
      { models: { userModel }, user }: Context
    ) => {
      const userDoc = await userModel.findById(user);
      if (!userDoc)
        throw new ApolloError(
          "Must be signed in to update profile.",
          NOT_AUTHENICATED
        );

      // Set the new username/bio
      userDoc.username = username;
      userDoc.bio = bio;

      // Upload the avatar and profileImg to image server
      if (avatar) {
        const uploadURL = await processUpload(avatar);
        userDoc.avatar = uploadURL;
      }
      if (profileImg) {
        const uploadURL = await processUpload(profileImg);
        userDoc.profileImg = uploadURL;
      }

      // Save changes
      const savedUser = await userDoc.save();
      console.log(savedUser);
      return savedUser;
    },
  },
  User: {
    tweets: async (
      parent: User,
      args: any,
      { models: { tweetModel, userModel } }: Context
    ) => {
      const tweetIDs = parent.tweetIDs;
      const retweetIDs = parent.retweetIDs;

      // Get followed users
      const followedUsers = await userModel.find({
        _id: { $in: parent.followingIDs },
      });

      // Get followed user's retweet IDs and tweet IDs
      let followedRetweetIDs: string[] = [];
      let followedTweetIDs: string[] = [];
      followedUsers.forEach((user) => {
        followedTweetIDs = followedTweetIDs.concat(user.tweetIDs as string[]);
        followedRetweetIDs = followedRetweetIDs.concat(
          user.retweetIDs as string[]
        );
      });

      // Get user's tweets + retweets + follower tweets + follow retweets
      const tweets = await tweetModel.find({
        _id: {
          $in: [
            ...tweetIDs,
            ...retweetIDs,
            ...followedRetweetIDs,
            ...followedTweetIDs,
          ],
        },
      });

      // Sort tweets by date
      tweets.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return tweets;
    },
    bookmarks: async (
      parent: User,
      args: any,
      { models: { tweetModel } }: Context
    ) => {
      // Get bookmarked tweets
      const bookmarkedTweets = tweetModel.find({
        _id: { $in: parent.bookmarkIDs },
      });

      return bookmarkedTweets;
    },
    mentions: async (
      parent: User,
      args: any,
      { models: { tweetModel } }: Context
    ) => {
      // Get tweets the user was mentioned in
      const mentionedTweets = await tweetModel.find({
        _id: { $in: parent.mentionIDs },
      });

      return mentionedTweets;
    },
    lists: async (
      parent: User,
      args: any,
      { models: { listModel } }: Context
    ) => {
      // Get all the lists from user's listID array
      const lists = await listModel.find({ _id: { $in: parent.listIDs } });

      // Sort the lists by their created date
      lists.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );

      return lists;
    },
    likedTweets: async (
      parent: User,
      args: any,
      { models: { tweetModel } }: Context
    ) => {
      // Get all the tweets from user's likedTweetIDs
      const likedTweets = await tweetModel.find({
        _id: { $in: parent.likedTweetIDs },
      });

      // Sort the tweets by their date
      likedTweets.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return likedTweets;
    },
    joinDate: (parent: User) => {
      return new mongoose.Types.ObjectId(parent.id as string).getTimestamp();
    },
  },
};
