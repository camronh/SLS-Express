const serverless = require("serverless-http");
const express = require("express");
const app = express();

try {
  require("dotenv").config();
} catch (e) {
  console.log("No .env file found");
}

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/path/:pathParam", function (req, res) {
  res.send(
    "Hello World! We on V2!\n\n" +
      req.params.pathParam +
      "\n\n" +
      process.env.API_KEY
  );
});

module.exports.handler = serverless(app);
