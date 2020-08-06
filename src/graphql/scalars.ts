import {
  EmailAddressResolver,
  TimestampResolver,
  DateTimeResolver,
  DateResolver,
} from "graphql-scalars";

export const scalarResolvers = {
  EmailAddress: EmailAddressResolver,
  Timestamp: TimestampResolver,
  DateTime: DateTimeResolver,
  Date: DateResolver,
};
