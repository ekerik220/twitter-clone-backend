import mongoose from "mongoose";
import { ListDbObject } from "../typescript/graphql-codegen-typings";

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  img: String,
  userIDs: { type: [String], required: true },
  createdDate: { type: Date, required: true },
});

export type ListDocument = ListDbObject & mongoose.Document;

const List = mongoose.model<ListDocument>("List", listSchema);

export default List;
