import { dynamo, marshall } from "../utils";
import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import userService from "./userService";
import { PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

import { mockClient } from "aws-sdk-client-mock";

const ddbMock = mockClient(dynamo);

describe("User Service", () => {
  const userParams = {
    username: "testUser",
    email: "camron@example.com",
    firstName: "Camron",
    lastName: "MacInnes",
  };
  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutItemCommand);
  });

  // Test for createUser function
  it("should create a user", async () => {
    const user = await userService.createUser(userParams);
    expect(user.username).to.equal(userParams.username);
    expect(user.email).to.equal(userParams.email);
    expect(user.firstName).to.equal(userParams.firstName);
    expect(user.lastName).to.equal(userParams.lastName);
  });

  // Test for getUser function
  it("should get a user", async () => {
    const user = await userService.createUser(userParams);

    ddbMock.on(GetItemCommand).resolves({
      Item: marshall(user.getData()),
    });

    const fetchedUser = await userService.getUser(user.userID);
    expect(fetchedUser).to.deep.equal(user);
  });

  // Test for updateUser function
  it("should update a user", async () => {
    const user = await userService.createUser(userParams);
    ddbMock.on(GetItemCommand).resolves({
      Item: marshall(user.getData()),
    });
    const updatedUserParams = { ...userParams, firstName: "Updated" };
    const updatedUser = await userService.updateUser(
      user.userID,
      updatedUserParams
    );
    expect(updatedUser.firstName).to.equal("Updated");
  });

  // Test for deleteUser function
  it("should delete a user", async () => {
    const user = await userService.createUser(userParams);
    await userService.deleteUser(user.userID);
    try {
      await userService.getUser(user.userID);
    } catch (error) {
      expect(error.message).to.equal("User not found");
    }
  });
});
