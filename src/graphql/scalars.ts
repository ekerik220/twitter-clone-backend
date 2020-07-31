import {
  EmailAddressResolver,
  TimestampResolver,
  DateTimeResolver,
} from "graphql-scalars";

export const scalarResolvers = {
  EmailAddress: EmailAddressResolver,
  Timestamp: TimestampResolver,
  Date: DateTimeResolver,
};
