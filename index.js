import express from "express";
import { createServer } from "http";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/index.js";

const app = express();
const server = createServer(app);

(async () => {
  await connectDB();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello there");
});

import userRoutes from "./API/Routes/user.js";

app.use("/user", userRoutes);

server.listen(PORT, () => {
  console.log("server running on PORT:", PORT);
});
