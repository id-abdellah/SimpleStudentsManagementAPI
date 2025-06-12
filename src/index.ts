import express, { NextFunction, Request, Response } from "express"
import { studentsRouter } from "./routes/students.route";
import { Jsend, JsendStatus } from "./utils/Jsend";

const app = express();

app.use(express.json());
app.use("/api/students", studentsRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    res.status(500).send(new Jsend(JsendStatus.ERROR, null, "Internal Server Error"))
})

app.listen(8080, "localhost", () => {
    console.log("Running on: http://localhost:8080")
})