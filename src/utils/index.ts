import { DynamoDB } from "@aws-sdk/client-dynamodb";
// Configure DynamoDB to use local Docker client
export const dynamo = new DynamoDB({ region: "us-east-1" });

export { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
