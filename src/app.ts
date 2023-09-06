import serverless from "serverless-http";
import express, { Request, Response } from "express";
import UserRouter from "./routes/Users";

try {
  require("dotenv").config();
} catch (e) {
  console.log("No .env file found");
}
const app = express();

// Middleware
app.use(express.json());
app.use((req: Request, res: Response, next) => { // Logger
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// Routes
app.use("/users", UserRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/path/:pathParam", (req: Request, res: Response) => {
  console.log({ req });
  res.send(
    `Hello World! We on V2!\n\n${req.params.pathParam}\n\n${process.env.API_KEY}`
  );
});

export const handler = serverless(app);
export { app };
