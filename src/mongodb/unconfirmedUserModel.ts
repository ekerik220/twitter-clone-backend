import mongoose from "mongoose";
import { UnconfirmedUserDbObject } from "../typescript/graphql-codegen-typings";

const unconfirmedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
  },
  confirmationCode: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

export type UnconfirmedUserDocument = UnconfirmedUserDbObject &
  mongoose.Document;

const UnconfirmedUser = mongoose.model<UnconfirmedUserDocument>(
  "UnconfirmedUser",
  unconfirmedUserSchema
);

export default UnconfirmedUser;
