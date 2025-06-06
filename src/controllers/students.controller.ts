import { Request, Response } from "express"
import DB from "../config/db"
import { Student } from "../@types/student";
import { Jsend, JsendStatus } from "../utils/Jsend";

export async function getAllStudents(req: Request, res: Response) {
    const l = req.query.limit;
    const p = req.query.page;

    const limit = Number(l) || 5;
    const page = Number(p) > 0 ? Number(p) : 1;
    const offset = (page - 1) * limit;

    const [rows] = await DB.query("SELECT * FROM students LIMIT ? OFFSET ?", [limit, offset]);
    const students = rows as Student[];


    const response = {
        limit,
        page,
        ...new Jsend(JsendStatus.SUCCESS, students)
    }

    res.status(200).send(response);
};

export async function getStudentByID(req: Request<{ studentID: Student["id"] }>, res: Response) {
    const studentID = +req.params.studentID;
    const [rows] = await DB.query("SELECT * FROM students WHERE students.id = ?", [studentID]);
    const student = rows as Student[];

    if (student.length === 0) {
        res.status(404).send(new Jsend(JsendStatus.FAIL, null, `Student with id ${studentID} not found`));
        return;
    };

    res.status(200).send(new Jsend(JsendStatus.SUCCESS, student));
};

export async function createStudent(req: Request<{}, {}, Omit<Student, "id">>, res: Response) {
    let body = req.body;
    const [rows] = await DB.query("INSERT INTO students VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Object.values(body));
    res.status(201).send(new Jsend(JsendStatus.SUCCESS, [body], "Student created successfuly"))
}

export async function updateStudent(req: Request<{ studentID: Student["id"] }, {}, Partial<Omit<Student, "id">>>, res: Response) {
    const studentID = req.params.studentID;
    const body = req.body;

    body.enrollment_date = body.enrollment_date?.slice(0, 19).replace("T", " ")

    const fields = Object.keys(body)
    const values = Object.values(body);

    const setClause = fields.map((key) => `${key} = ?`).join(", ");

    try {
        await DB.query(`UPDATE students SET ${setClause} WHERE students.id = ?`, [...values, studentID]);
        res.status(200).send(new Jsend(JsendStatus.SUCCESS, null))
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function deleteStudent(req: Request<{ studentID: number }>, res: Response) {
    const studentID = +req.params.studentID;

    await DB.query("DELETE FROM students WHERE students.id = ?", [studentID]);
    res.status(200).send(new Jsend(JsendStatus.SUCCESS, null))
}

export async function deleteAllStudents(req: Request, res: Response) {
    await DB.query("TRUNCATE students");
    res.status(200).send(new Jsend(JsendStatus.SUCCESS));
}