import {
  MutationAddListArgs,
  List,
  MutationAddUserToListArgs,
  QueryGetListArgs,
  MutationUpdateListArgs,
  MutationDeleteListArgs,
} from "../../typescript/graphql-codegen-typings";
import { Context } from "../../main";
import { ApolloError } from "apollo-server";
import { NOT_AUTHENICATED } from "../../utils/errorCodes";
import { processUpload } from "../../utils/processUpload";

export const listResolvers = {
  Query: {
    getList: async (
      parent: any,
      { id }: QueryGetListArgs,
      { models: { listModel } }: Context
    ) => {
      const list = await listModel.findById(id);
      return list;
    },
  },
  Mutation: {
    addList: async (
      parent: any,
      { name, description, img }: MutationAddListArgs,
      { models: { userModel, listModel }, user }: Context
    ) => {
      // check if we're logged in
      if (!user)
        throw new ApolloError(
          "Must be logged in to add a list.",
          NOT_AUTHENICATED
        );

      const uploadUrl = img ? await processUpload(img) : undefined;

      // create a list object
      const list: List = {
        name,
        description,
        img: uploadUrl,
        userIDs: [],
        createdDate: new Date(),
      };

      // add it to list DB
      const savedList = await listModel.create(list);

      // add list to user's lists array (front of list)
      await userModel.findByIdAndUpdate(
        user,
        {
          $push: { listIDs: savedList.id },
        },
        { new: true }
      );

      return savedList;
    },
    addUserToList: async (
      parent: any,
      { userID, listID }: MutationAddUserToListArgs,
      { models: { listModel, userModel } }: Context
    ) => {
      // Add userID to the list's userIDs field
      await listModel.findByIdAndUpdate(
        listID,
        {
          $push: { userIDs: userID },
        },
        { new: true }
      );

      // Get the document of the user we added to return so front-end
      // can update the UI without making another request
      const userDoc = userModel.findById(userID);

      return userDoc;
    },
    updateList: async (
      parent: any,
      { listID, name, description, img }: MutationUpdateListArgs,
      { models: { listModel } }: Context
    ) => {
      let updatedList;

      // if img Upload was sent, process it and update
      // img along with name and description
      if (img) {
        const uploadURL = await processUpload(img);
        updatedList = await listModel.findByIdAndUpdate(
          listID,
          {
            name,
            description,
            img: uploadURL,
          },
          { new: true }
        );
        // else, just update name and description and leave
        // the img as it was
      } else {
        updatedList = await listModel.findByIdAndUpdate(
          listID,
          {
            name,
            description,
          },
          { new: true }
        );
      }

      return updatedList;
    },
    deleteList: async (
      parent: any,
      { listID }: MutationDeleteListArgs,
      { models: { listModel, userModel }, user }: Context
    ) => {
      // remove the listID from user's listIDs
      await userModel.findByIdAndUpdate(user, { $pull: { listIDs: listID } });

      // delete the list document
      const deletedList = await listModel.findByIdAndDelete(listID);

      return deletedList;
    },
  },
  List: {
    users: async (
      parent: List,
      args: any,
      { models: { userModel } }: Context
    ) => {
      // get all the user documents that correspond to the IDs in userIDs
      const users = await userModel.find({ _id: { $in: parent.userIDs } });
      return users;
    },
  },
};
