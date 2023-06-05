import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config({ path: "./config.env" });
import express from "express";
const app = express();
import { router as userRouter } from "./routes/userRoute.js";
import { router as notesRouter } from "./routes/notesRoute.js";

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected Sucessfully...."));

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use("/user", userRouter);
app.use("/notes", notesRouter);

app.get("/", (req, res) => {
  res.send("GET request to the homepage");
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT} starting ........`);
});
