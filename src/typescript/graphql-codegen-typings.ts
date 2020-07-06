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
};


export type Query = {
  __typename?: 'Query';
  users: Array<Maybe<User>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUser: User;
};


export type MutationAddUserArgs = {
  email: Scalars['EmailAddress'];
};

export type User = {
  __typename?: 'User';
  /** User ID. */
  id?: Maybe<Scalars['ID']>;
  /** User email. */
  email: Scalars['EmailAddress'];
};
