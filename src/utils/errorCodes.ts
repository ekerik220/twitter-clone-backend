// Requested document was not found on the database
export const DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND";

// Confirmation code used to confirm user's email is expired (2 hour limit)
export const EXPIRED_CONFIRMATION_CODE = "EXPIRED_CONFIRMATION_CODE";

// Confirmation code used to confirm user's email is incorrect
export const INCORRECT_CONFIRMATION_CODE = "INCORRECT_CONFIRMATION_CODE";

// User with given email already exists on the DB
export const DUPLICATE_EMAIL = "DUPLICATE_EMAIL";

// Trying to add a fully confirmed user before adding them as an unconfirmed user and confirming their email
export const ADDING_UNCONFIRMED_USER = "ADDING_UNCONFIRMED_USER";

// Invalid password
export const INVALID_PASSWORD = "INVALID_PASSWORD";

// Not authenticated
export const NOT_AUTHENICATED = "NOT_AUTHENTICATED";
