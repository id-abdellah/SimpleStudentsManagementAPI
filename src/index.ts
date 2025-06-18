import express, { NextFunction, Request, Response } from "express"
import { studentsRouter } from "./routes/students.route"
import { Jsend, JsendStatus } from "./utils/Jsend"
import { usersRouter } from "./routes/users.route"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const app = express();

// Making express serving static files "in this example serving user uploads avatar"
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use(express.json());

app.use("/api/students", studentsRouter);
app.use("/api/users", usersRouter)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    res.status(500).send(new Jsend(JsendStatus.ERROR, null, "Internal Server Error"))
})

app.listen(8080, "localhost", () => {
    console.log("Running on: http://localhost:8080")
})