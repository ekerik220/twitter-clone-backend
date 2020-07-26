export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  EmailAddress: any;
  Timestamp: any;
  Date: any;
  Upload: any;
};









export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Add an unconfirmed user to the DB. This will send an email to the given address with a 6 digit code
   * that has an expiry date of 2h. Have the user input this code and then use confirmUser() to check if
   * it's valid.
   */
  addUnconfirmedUser: Scalars['ID'];
  /**
   * Add a fully confirmed user to the DB by providing the _id of an unconfirmedUser that has
   * had it's confirmed field set to true (email has been confirmed), as well as a password.
   */
  addUser: Scalars['ID'];
  /**
   * Take a 6 digit code (this was sent to the user by email), and the user's email address and
   * check that these match up in the DB. If they do, this will set their 'confirmed' field to
   * true so they can be added to the confirmed users list with addUser().
   */
  confirmUser: Scalars['ID'];
  /**
   * Take an email or username and a password. If it matches a user in the database,
   * send back a JWT with the user ID.
   */
  login: Scalars['String'];
  root?: Maybe<Scalars['String']>;
  setAvatarImage: User;
};


export type MutationAddUnconfirmedUserArgs = {
  email: Scalars['EmailAddress'];
  username: Scalars['String'];
  birthdate: Scalars['Date'];
};


export type MutationAddUserArgs = {
  id: Scalars['ID'];
  password: Scalars['String'];
};


export type MutationConfirmUserArgs = {
  confirmationCode: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  loginName: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSetAvatarImageArgs = {
  file: Scalars['Upload'];
};

export type Query = {
  __typename?: 'Query';
  /** Checks if a user exists with given email. */
  emailTaken: Scalars['Boolean'];
  root?: Maybe<Scalars['String']>;
  /** Gets the currently logged in user */
  self: User;
  /** Checks if a user with given username exists. */
  usernameTaken: Scalars['Boolean'];
  users: Array<Maybe<User>>;
};


export type QueryEmailTakenArgs = {
  email: Scalars['String'];
};


export type QueryUsernameTakenArgs = {
  username: Scalars['String'];
};





export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['ID']>;
  email: Scalars['EmailAddress'];
  username: Scalars['String'];
  birthdate: Scalars['Date'];
  password: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  handle?: Maybe<Scalars['String']>;
};

export type UnconfirmedUser = {
  __typename?: 'UnconfirmedUser';
  id?: Maybe<Scalars['ID']>;
  email: Scalars['EmailAddress'];
  username: Scalars['String'];
  birthdate: Scalars['Date'];
  confirmed: Scalars['Boolean'];
  confirmationCode: Scalars['String'];
  timestamp: Scalars['Timestamp'];
};

export type UploadFileResponse = {
  __typename?: 'UploadFileResponse';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
  url: Scalars['String'];
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

import { ObjectID } from 'mongodb';
export type UserDbObject = {
  _id?: Maybe<ObjectID>,
  email: any,
  username: string,
  birthdate: any,
  password: string,
  avatar?: Maybe<string>,
  handle?: Maybe<string>,
};

export type UnconfirmedUserDbObject = {
  _id?: Maybe<ObjectID>,
  email: any,
  username: string,
  birthdate: any,
  confirmed: boolean,
  confirmationCode: string,
  timestamp: any,
};
