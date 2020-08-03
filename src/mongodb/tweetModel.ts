import mongoose from "mongoose";
import { TweetDbObject } from "../typescript/graphql-codegen-typings";

const tweetSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  body: {
    type: String,
  },
  images: {
    type: [String],
  },
  replyingTo: {
    type: String,
  },
  commentIDs: {
    type: [String],
    required: true,
  },
  likeIDs: {
    type: [String],
    required: true,
  },
  retweetIDs: {
    type: [String],
    required: true,
  },
  retweetParent: {
    type: String,
  },
});

export type TweetDocument = TweetDbObject & mongoose.Document;

const Tweet = mongoose.model<TweetDocument>("Tweet", tweetSchema);

export default Tweet;
