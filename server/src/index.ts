import express from "express";
import cors from "cors";
import dotenv from "dotenv";  
import tasksRouter from "./routes/tasks";
import projectsRouter from "./routes/projects"; 
import teamRouter from "./routes/team"; 
import { errorHandler } from "./middleware/errorHandler";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectsRouter); 
app.use("/api/team", teamRouter); 
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
