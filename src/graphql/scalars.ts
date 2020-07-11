import {
  EmailAddressResolver,
  TimestampResolver,
  DateResolver,
} from "graphql-scalars";

export const scalarResolvers = {
  EmailAddress: EmailAddressResolver,
  Timestamp: TimestampResolver,
  Date: DateResolver,
};
