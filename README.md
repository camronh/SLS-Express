# SLS Express App

We need to move away from EC2 APIs. They are hard to maintain, hard to scale, hard to monitor, hard to secure, hard to troubleshoot, and a lot more. We will see huge benifits in migrating to serverless. Scaling, security, resiliance, and dev velocity are some of the benefits we will see. By using express, all of the devs can keep building in the language and setup they are used to. It will also make it really easy to consolidate the other EC2 express APIs into 1 serverless API. By combining CI/CD with serverless, devs and PMs wont need to learn to manage servers and infrastructure. They can just maintain the github repo and trust that their infrastructure is being managed by the CI/CD pipeline + AWS managed hosting.

## Getting Started

Build a normal express app. Building from scratch is pretty simple so we will just do that. We will also need the `serverless-http` package to make the express app work with serverless.

```bash
mkdir sls-express-app
code sls-express-app
npm init -y
npm install --save express serverless-http
```

### Index.js

The only real adjustments to our code that we need to make will happen in the index.js file. Lets make one that just has some simple endpoints in it. But be sure to import and export according to [this guide](https://www.serverless.com/blog/serverless-express-rest-api/).

```javascript
// Import our deps
const serverless = require("serverless-http");
const express = require("express");

// Standard express app
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/path/:pathParam", function (req, res) {
  res.send("Hello World! We on V2!\n\n" + req.params.pathParam);
});

// Here, instead of listening on a port, we export the handler.
module.exports.handler = serverless(app);

// We can also start the listener for developing locally real quick
// app.listen(3000, function () {
//   console.log("Example app listening on port 3000!");
// });
```

Thats pretty much it for the express api. Now we need our serverless config.

### Serverless.yml

I copied this almost exactly from the [this guide](https://www.serverless.com/blog/serverless-express-rest-api/). But I did have to change the node version as it was out of date.

```yaml
service: my-express-application

provider:
  name: aws
  runtime: nodejs14.x
  stage: dev
  region: us-east-1

functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: "ANY {proxy+}"
```

This file is where we will keep our IaaC too. For now this will work just to prove the concept but we will be using this file for deploying our permissions and any infrastructure.

Okay we are ready to deploy.

## Deploying

Deploying works by running the `sls deploy` command. Make sure you have [serverless installed globally](https://www.serverless.com/framework/docs/getting-started) and your [aws credentials are set in the aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

```bash
sls deploy
```

This will deploy the express app and spit out a url(s) for you to use it. Since we only made GET endpoints, we can open them in the browser to try them out.

## CI/CD

Now that we have a working express app, we can start to add CI/CD to it. We will be [this guide](https://github.com/serverless/github-action).

To set up CI/CD with github actions we first need to make a workflow folder.

```bash
mkdir .github
mkdir .github/workflows
```

Then we need to make a workflow file. I named mine `serverless-deploy.yml` but you can name it whatever you want.

```yaml
name: SLS Deploy Main Branch # Name the workflow

on:
  push:
    branches:
      - main # Set a branch to deploy when pushed to

jobs:
  deploy:
    name: deploy
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x]
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - name: serverless deploy
        uses: serverless/github-action@v3.1
        with:
          args: deploy
        env:
          # These credentials will be set later
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

We will need to set our secrets, or this will fail on deployment.

### Secrets

Now from here, this will require that the repo is published to github already.

1. Go to the repo settings
2. Go to secrets in the left pane, then actions
3. Add the secrets `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with the values from the aws-cli (use `cat ~/.aws/credentials` to see them)


### Deploying

Thats it! Now push to main and check your actions tab to keep up with the progress of the deployment. If it fails, you can see the logs in the actions tab. If it succeeds, you can see the url in the logs.

## Conclusion

This is a pretty simple example of how to get started with serverless. We will be using this as a base for our other APIs. We will also be using this as a base for our other infrastructure. We will be using this to deploy our permissions and other infrastructure. 