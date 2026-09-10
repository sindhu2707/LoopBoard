import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/tasks";
import projectsRouter from "./routes/projects";
import teamRouter from "./routes/team";
import usersRouter from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/team", teamRouter);
app.use("/api/users", usersRouter);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Close the Prisma connection pool cleanly on shutdown (important on
// platforms like Render/Railway that send SIGTERM on redeploys).
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
