import mongoose from "mongoose";
import { UserDbObject } from "../typescript/graphql-codegen-typings";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
});

export type UserDocument = UserDbObject & mongoose.Document;

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
