const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/path/:pathParam", function (req, res) {
  res.send("Hello World! We on V2!\n\n" + req.params.pathParam);
});

module.exports.handler = serverless(app);
