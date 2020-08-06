import mongoose from "mongoose";
import { HashtagDbObject } from "../typescript/graphql-codegen-typings";

const hashtagSchema = new mongoose.Schema({
  hashtag: {
    type: String,
    required: true,
  },
  tweetIDs: {
    type: [String],
    required: true,
  },
  numOfTweets: {
    type: Number,
    required: true,
  },
});

export type HashtagDocument = HashtagDbObject & mongoose.Document;

const Hashtag = mongoose.model<HashtagDocument>("Hashtag", hashtagSchema);

export default Hashtag;
