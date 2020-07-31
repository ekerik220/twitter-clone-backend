import mongoose from "mongoose";
import { UserDbObject } from "../typescript/graphql-codegen-typings";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 80,
  },
  username: {
    type: String,
    required: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 255,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
  },
  tweets: {
    type: [String],
    required: true,
  },
});

export type UserDocument = UserDbObject & mongoose.Document;

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
