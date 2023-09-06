import { expect } from "chai";
import { Request, Response } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers";
import userService from "../services/userService";
import { User } from "../models/User";
import { dynamo, marshall } from "../utils";
import { PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import sinon from "sinon";

// Create a mock of DynamoDB
const ddbMock = mockClient(dynamo);

describe("User Controllers", () => {
  let res: any;
  let req: any;

  const userParams = {
    username: "testUser",
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
  };

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(), // This stub makes status() return `this` for chaining
      send: sinon.stub(),
    };

    req = {} as Request;
    // Reset the mock before each test
    ddbMock.reset();
    ddbMock.on(PutItemCommand);
  });

  // Test for createUser controller
  it("should create a user", async () => {
    req.body = User.inputSchema.parse(userParams);
    await createUser(req, res);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it("should get a user", async () => {
    req.params = { id: "validUserId" };

    // Mock the GetItemCommand response
    ddbMock.on(GetItemCommand).resolves({
      Item: marshall(userParams),
    });

    await getUser(req, res);
    expect(res.status.calledWith(200)).to.be.true;
  });

  // Test for updateUser controller
  it("should update a user", async () => {
    const user = await userService.createUser(userParams);

    // Mock the GetItemCommand response
    ddbMock.on(GetItemCommand).resolves({
      Item: marshall({ ...user.getData(), firstName: "Updated" }),
    });

    req.body = { ...userParams, firstName: "Updated" };
    req.params = { id: user.userID };

    await updateUser(req, res);
    expect(res.status.calledWith(200)).to.be.true;
  });

  // Test for deleteUser controller
  it("should delete a user", async () => {
    req.params = { id: "validUserId" };
    await deleteUser(req, res);
    expect(res.status.calledWith(200)).to.be.true;
  });

  // Edge Case: Attempt to get a user that does not exist
  it("should return 404 when trying to get a non-existent user", async () => {
    req.params = { id: "nonExistentUserId" };

    // Mock the GetItemCommand response to return null
    ddbMock.on(GetItemCommand).resolves({});

    await getUser(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  // Edge Case: Attempt to update a user that does not exist
  it("should return 400 when trying to update a non-existent user", async () => {
    req.params = { id: "nonExistentUserId" };

    // Mock the GetItemCommand response to return null
    ddbMock.on(GetItemCommand).resolves({});

    await updateUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });
});
