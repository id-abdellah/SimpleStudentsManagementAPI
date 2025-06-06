import { NextFunction, Request, Response } from "express";
import DB from "../config/db"
import { z } from "zod";
import { Student } from "../@types/student";
import { Jsend, JsendStatus } from "../utils/Jsend";


/**
 * Validating Student Informations. Coming From The Client
 */

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const studentSchema = z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    dob: z.string().regex(dateRegex, "dob must be in YYYY-MM-DD format"),
    gender: z.enum(["female", "male"]),
    marital_status: z.enum(["single", "divorced", "married", "widowed"]),
    email: z.string().email(),
    phone: z.string().min(8),
    address: z.string(),
    nationality: z.string(),
    enrollment_date: z.string().datetime({ message: "enrollement_date must be a valid ISO datetime" }),
    guardian_name: z.string().nonempty(),
    guardian_contact: z.string().nonempty(),
}).strict();

export function validateStudent(req: Request<{}, {}, Student>, res: Response, next: NextFunction) {
    const body = req.body;
    try {
        studentSchema.parse(body);
        // converting "YYYY-MM-DDTHH:MM:SSZ" => "YYYY-MM-DD HH:MM:SS" 
        req.body.enrollment_date = req.body.enrollment_date.slice(0, 19).replace("T", " ");
        next()
    } catch (error) {
        res.status(400).send(error)
    }
}



/**
 * updating a student informations body validation
 */

const updateStudentSchema = studentSchema.partial().strict();

export async function isStudentExist(req: Request<{ studentID: number }>, res: Response, next: NextFunction) {
    const studentID = +req.params.studentID;
    const [rows] = await DB.query("SELECT * FROM students WHERE students.id = ?", [studentID])
    const student = rows as Student[];

    if (student.length > 0) {
        next();
        return;
    }

    res.status(404).send(new Jsend(JsendStatus.FAIL, null, "Student not found"))
}

export async function validateUpdateStudentBody(req: Request<{}, {}, Partial<Omit<Student, "id">>>, res: Response, next: NextFunction) {
    const body = req.body;

    try {
        updateStudentSchema.parse(body)
        next()
    } catch (err) {
        res.status(400).send(err)
    }
}