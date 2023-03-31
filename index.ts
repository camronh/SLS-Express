import serverless from "serverless-http";
import express, { Request, Response } from "express";

try {
  require("dotenv").config();
} catch (e) {
  console.log("No .env file found");
}
const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/path/:pathParam", (req: Request, res: Response) => {
  console.log({ req });
  res.send(
    `Hello World! We on V2!\n\n${req.params.pathParam}\n\n${process.env.API_KEY}`
  );
});

export const handler = serverless(app);

// Start server locally
// app.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });
