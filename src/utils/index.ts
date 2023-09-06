import { DynamoDB } from "@aws-sdk/client-dynamodb";
// Configure DynamoDB to use local Docker client
export const dynamo = new DynamoDB({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

export { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// Create a new User-Table

async function createUserTable() {
  const params = {
    TableName: "Users",
    KeySchema: [
      {
        AttributeName: "userID",
        KeyType: "HASH",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "userID",
        AttributeType: "S",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  await dynamo.createTable(params);
}

// createUserTable();