const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

export const dynamo = new DynamoDBClient({ region: "us-east-1" });
