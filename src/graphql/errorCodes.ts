// Requested document was not found on the database
export const DOCUMENT_NOT_FOUND_ERROR = "DOCUMENT_NOT_FOUND_ERROR";

// Confirmation code used to confirm user's email is expired (2 hour limit)
export const EXPIRED_CONFIRMATION_CODE_ERROR =
  "EXPIRED_CONFIRMATION_CODE_ERROR";

// Confirmation code used to confirm user's email is incorrect
export const INCORRECT_CONFIRMATION_CODE_ERROR =
  "INCORRECT_CONFIRMATION_CODE_ERROR";

// User with given email already exists on the DB
export const DUPLICATE_EMAIL_ERROR = "DUPLICATE_EMAIL_ERROR";

// User with given username already exists on the DB
export const DUPLICATE_USER_ERROR = "DUPLICATE_USER_ERROR";

// Trying to add a fully confirmed user before adding them as an unconfirmed user and confirming their email
export const ADDING_UNCONFIRMED_USER_ERROR = "ADDING_UNCONFIRMED_USER_ERROR";
