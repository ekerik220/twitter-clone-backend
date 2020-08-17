export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  EmailAddress: any;
  Timestamp: any;
  Date: any;
  Upload: any;
};









export type Mutation = {
  __typename?: 'Mutation';
  addComment?: Maybe<Tweet>;
  addList: List;
  addOrRemoveBookmark: User;
  addOrRemoveLike: Array<Maybe<Scalars['ID']>>;
  addRetweet?: Maybe<Tweet>;
  addTweet?: Maybe<Tweet>;
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
  addUserToList: User;
  /**
   * Take a 6 digit code (this was sent to the user by email), and the user's email address and
   * check that these match up in the DB. If they do, this will set their 'confirmed' field to
   * true so they can be added to the confirmed users list with addUser().
   */
  confirmUser: Scalars['ID'];
  deleteList: List;
  followOrUnfollow: User;
  /**
   * Take an email or username and a password. If it matches a user in the database,
   * send back a JWT with the user ID.
   */
  login: Scalars['String'];
  root?: Maybe<Scalars['String']>;
  setAvatarImage: User;
  undoRetweet?: Maybe<Tweet>;
  updateList: List;
};


export type MutationAddCommentArgs = {
  replyingToID: Scalars['ID'];
  body: Scalars['String'];
};


export type MutationAddListArgs = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  img?: Maybe<Scalars['String']>;
};


export type MutationAddOrRemoveBookmarkArgs = {
  tweetID: Scalars['ID'];
};


export type MutationAddOrRemoveLikeArgs = {
  tweet: Scalars['ID'];
};


export type MutationAddRetweetArgs = {
  parentID: Scalars['ID'];
  body?: Maybe<Scalars['String']>;
};


export type MutationAddTweetArgs = {
  body: Scalars['String'];
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


export type MutationAddUserToListArgs = {
  userID: Scalars['ID'];
  listID: Scalars['ID'];
};


export type MutationConfirmUserArgs = {
  confirmationCode: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationDeleteListArgs = {
  listID: Scalars['ID'];
};


export type MutationFollowOrUnfollowArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  loginName: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSetAvatarImageArgs = {
  file: Scalars['Upload'];
};


export type MutationUndoRetweetArgs = {
  parentID: Scalars['ID'];
};


export type MutationUpdateListArgs = {
  listID: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  img?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Checks if a user exists with given email. */
  emailTaken: Scalars['Boolean'];
  getList?: Maybe<List>;
  /** Get user by their handle. */
  getUserByHandle: User;
  root?: Maybe<Scalars['String']>;
  search?: Maybe<Array<Maybe<Tweet>>>;
  /**
   * Returns all user's with the given substring somewhere in their username
   * or handle.
   */
  searchUsers: Array<Maybe<User>>;
  /** Gets the currently logged in user */
  self: User;
  trending: Array<Maybe<Hashtag>>;
  tweet: Tweet;
  /** Checks if a user with given username exists. */
  usernameTaken: Scalars['Boolean'];
  users: Array<Maybe<User>>;
  /** Returns three random user's to be used for follow suggestions */
  whoToFollow: Array<Maybe<User>>;
};


export type QueryEmailTakenArgs = {
  email: Scalars['String'];
};


export type QueryGetListArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryGetUserByHandleArgs = {
  handle: Scalars['String'];
};


export type QuerySearchArgs = {
  term: Scalars['String'];
};


export type QuerySearchUsersArgs = {
  term: Scalars['String'];
};


export type QueryTweetArgs = {
  id: Scalars['ID'];
};


export type QueryUsernameTakenArgs = {
  username: Scalars['String'];
};

export type Hashtag = {
  __typename?: 'Hashtag';
  id?: Maybe<Scalars['ID']>;
  hashtag: Scalars['String'];
  tweetIDs: Array<Maybe<Scalars['String']>>;
  numOfTweets: Scalars['Int'];
};

export type List = {
  __typename?: 'List';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  img?: Maybe<Scalars['String']>;
  userIDs: Array<Maybe<Scalars['String']>>;
  createdDate: Scalars['DateTime'];
  users?: Maybe<Array<Maybe<User>>>;
};


export type Tweet = {
  __typename?: 'Tweet';
  id?: Maybe<Scalars['ID']>;
  userID: Scalars['ID'];
  handle: Scalars['String'];
  date: Scalars['DateTime'];
  body?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  likeIDs: Array<Maybe<Scalars['ID']>>;
  replyingTo?: Maybe<Scalars['ID']>;
  commentIDs: Array<Maybe<Scalars['ID']>>;
  retweetIDs: Array<Maybe<Scalars['ID']>>;
  retweetParent?: Maybe<Scalars['ID']>;
  /** Returns all the comments on this tweet */
  comments?: Maybe<Array<Maybe<Tweet>>>;
  username?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};




export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['ID']>;
  _id?: Maybe<Scalars['ID']>;
  email: Scalars['EmailAddress'];
  username: Scalars['String'];
  birthdate: Scalars['Date'];
  password: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  handle: Scalars['String'];
  tweetIDs: Array<Maybe<Scalars['String']>>;
  retweetIDs: Array<Maybe<Scalars['ID']>>;
  retweetParentIDs: Array<Maybe<Scalars['ID']>>;
  mentionIDs: Array<Maybe<Scalars['ID']>>;
  followingIDs: Array<Maybe<Scalars['ID']>>;
  followedByIDs: Array<Maybe<Scalars['ID']>>;
  bookmarkIDs: Array<Maybe<Scalars['ID']>>;
  notifications: Array<Maybe<Notification>>;
  listIDs: Array<Maybe<Scalars['ID']>>;
  /** Gets all the tweets in user's tweet list */
  tweets?: Maybe<Array<Maybe<Tweet>>>;
  /** Gets all the user's bookmarked tweets */
  bookmarks?: Maybe<Array<Maybe<Tweet>>>;
  /** Gets all the tweets the user was mentioned in */
  mentions?: Maybe<Array<Maybe<Tweet>>>;
  /** Gets all the lists the user has */
  lists?: Maybe<Array<Maybe<List>>>;
};


export type UserTweetsArgs = {
  getRetweets?: Maybe<Scalars['Boolean']>;
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

export type Notification = {
  __typename?: 'Notification';
  type: Scalars['String'];
  user: User;
  tweet?: Maybe<Tweet>;
  notifierID: Scalars['ID'];
};


export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

import { ObjectID } from 'mongodb';
export type HashtagDbObject = {
  _id?: Maybe<ObjectID>,
  hashtag: string,
  tweetIDs: Array<Maybe<string>>,
  numOfTweets: number,
};

export type ListDbObject = {
  _id?: Maybe<ObjectID>,
  name: string,
  description?: Maybe<string>,
  img?: Maybe<string>,
  userIDs: Array<Maybe<string>>,
  createdDate: any,
};

export type TweetDbObject = {
  _id?: Maybe<ObjectID>,
  userID: string,
  handle: string,
  date: any,
  body?: Maybe<string>,
  images?: Maybe<Array<Maybe<string>>>,
  likeIDs: Array<Maybe<string>>,
  replyingTo?: Maybe<string>,
  commentIDs: Array<Maybe<string>>,
  retweetIDs: Array<Maybe<string>>,
  retweetParent?: Maybe<string>,
};

export type UserDbObject = {
  _id?: Maybe<ObjectID>,
  email: any,
  username: string,
  birthdate: any,
  password: string,
  avatar?: Maybe<string>,
  handle: string,
  tweetIDs: Array<Maybe<string>>,
  retweetIDs: Array<Maybe<string>>,
  retweetParentIDs: Array<Maybe<string>>,
  mentionIDs: Array<Maybe<string>>,
  followingIDs: Array<Maybe<string>>,
  followedByIDs: Array<Maybe<string>>,
  bookmarkIDs: Array<Maybe<string>>,
  notifications: Array<Maybe<Notification>>,
  listIDs: Array<Maybe<string>>,
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
