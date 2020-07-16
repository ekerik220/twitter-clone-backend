import {
  MutationAddUserArgs,
  MutationAddUnconfirmedUserArgs,
  MutationConfirmUserArgs,
  User,
  UnconfirmedUser,
} from "../../typescript/graphql-codegen-typings";
import { Context } from "../../main";
import { ApolloError, ValidationError } from "apollo-server";
import {
  DOCUMENT_NOT_FOUND_ERROR,
  EXPIRED_CONFIRMATION_CODE_ERROR,
  INCORRECT_CONFIRMATION_CODE_ERROR,
  DUPLICATE_EMAIL_ERROR,
  DUPLICATE_USER_ERROR,
  ADDING_UNCONFIRMED_USER_ERROR,
} from "../errorCodes";
import mongoose, { Error } from "mongoose";
import bcrypt from "bcrypt";
import { sendConfirmationCodeEmail } from "./emailer";

export const userResolvers = {
  Query: {
    users: async (
      parent: any,
      args: any,
      { models: { userModel } }: Context
    ) => {
      const users = await userModel.find();
      return users;
    },
  },
  Mutation: {
    //* Add a fully confirmed user to the DB
    addUser: async (
      parent: any,
      { id, password }: MutationAddUserArgs,
      { models: { userModel, unconfirmedUserModel } }: Context
    ) => {
      // get the unconfirmedUser for given id
      const unconfirmedUser: UnconfirmedUser | null = await unconfirmedUserModel.findById(
        id
      );

      // check that user exists as an unconfirmed user and confirmed flag is true... throw an error if not
      if (!unconfirmedUser || !unconfirmedUser.confirmed)
        throw new ApolloError(
          "Cannot add a fully confirmed user before adding them as an unconfirmed user and confirming their email",
          ADDING_UNCONFIRMED_USER_ERROR
        );

      // hash the given password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // create User object to add to DB
      const user: User = {
        email: unconfirmedUser.email,
        username: unconfirmedUser.username,
        birthdate: unconfirmedUser.birthdate,
        password: hashedPassword,
      };

      // try to add it to the DB
      // also, remove all unconfirmedUser entries that match this email
      // as they are no longer needed (this email is now claimed).
      try {
        const savedUser = await userModel.create(user);
        // ! deleteMany wasn't deleting anything without passing in a
        // ! callback func... it should be optional, why doesn't it work?
        unconfirmedUserModel.deleteMany({ email: savedUser.email }, () => {});
        return savedUser;
      } catch (err) {
        // if ValidationError, check/handle if it's because of a duplicate user
        if (err instanceof mongoose.Error.ValidationError)
          handleDuplicateUserError(err);
        console.log(err);
      }
    },
    //* Adds an unconfirmedUser to the DB with a random confirmation code and an expiry timestamp (2h).
    addUnconfirmedUser: async (
      parent: any,
      { email, username, birthdate }: MutationAddUnconfirmedUserArgs,
      { models: { userModel, unconfirmedUserModel } }: Context
    ) => {
      // Make sure a user with this email or username doesn't exist in the *confirmed* users DB first
      if (await userModel.exists({ email }))
        throw new ApolloError(
          "User with that email already exists.",
          DUPLICATE_EMAIL_ERROR
        );
      if (await userModel.exists({ username }))
        throw new ApolloError(
          "User with that user name already exists.",
          DUPLICATE_USER_ERROR
        );

      try {
        // create UnconfirmedUser object to add to DB
        const unconfirmedUser: UnconfirmedUser = {
          email,
          username,
          birthdate,
          confirmed: false,
          confirmationCode: randomCode(),
          timestamp: Date.now() + hoursToMilliseconds(2),
        };
        // add it to the DB
        const savedUser = await unconfirmedUserModel.create(unconfirmedUser);
        sendConfirmationCodeEmail(savedUser.email, savedUser.confirmationCode);
        return savedUser._id;
      } catch (err) {
        console.log(err);
        return -1;
      }
    },
    //* Checks if given confirmationCode matches the code on file and sets confirmed flag for user to true
    confirmUser: async (
      parent: any,
      { confirmationCode, id }: MutationConfirmUserArgs,
      { models: { unconfirmedUserModel } }: Context
    ) => {
      // Get user matching email
      const user = await unconfirmedUserModel.findById(id);

      // If no user matching the given id in DB, throw an error
      if (!user)
        throw new ApolloError(
          "That unconfirmed user does not exist.",
          DOCUMENT_NOT_FOUND_ERROR
        );

      // If the code on file is expired, throw an error
      if (Date.now() > user.timestamp)
        throw new ApolloError(
          "Confirmation code is expired.",
          EXPIRED_CONFIRMATION_CODE_ERROR
        );

      // If the code on file does not match the given code, throw an error
      if (user.confirmationCode !== confirmationCode)
        throw new ApolloError(
          "Confirmation code does not match.",
          INCORRECT_CONFIRMATION_CODE_ERROR
        );

      // If we passed the above checks we should be safe to set user's confirmed status to true
      user.confirmed = true;
      user.save();
      return user._id;
    },
  },
};

/** Returns a random string of 6 numbers to use as a confirmation code */
function randomCode(): string {
  return Math.random().toString(9).substr(2, 6);
}

/** Converts hours to milliseconds */
function hoursToMilliseconds(hours: number): number {
  return hours * 60 * 60 * 1000;
}

/** If a given error indicates that email or username already exist in the DB, throw appropriate ApolloError */
function handleDuplicateUserError(err: any) {
  if (err.errors["email"] && err.errors["email"].kind === "unique")
    throw new ApolloError(
      "User with that email already exists.",
      DUPLICATE_EMAIL_ERROR
    );
  if (err.errors["username"] && err.errors["username"].kind == "unique")
    throw new ApolloError(
      "User with that user name already exists.",
      DUPLICATE_USER_ERROR
    );
}
