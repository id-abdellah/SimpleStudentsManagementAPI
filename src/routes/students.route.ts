import { Router } from "express";
import { createStudent, deleteAllStudents, deleteStudent, getAllStudents, getStudentByID, updateStudent } from "../controllers/students.controller";
import { isStudentExist, validateStudent, validateUpdateStudentBody } from "../middlewares/student.middleware";

let router = Router();

router.get("/", getAllStudents)

router.get("/:studentID", getStudentByID)

router.post("/", validateStudent, createStudent)

router.patch("/:studentID", isStudentExist, validateUpdateStudentBody, updateStudent)

router.delete("/:studentID", isStudentExist, deleteStudent)

router.delete("/", deleteAllStudents)

export { router as studentsRouter };