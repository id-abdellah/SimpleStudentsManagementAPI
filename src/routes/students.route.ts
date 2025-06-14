import { Router } from "express";
import { createStudent, deleteAllStudents, deleteStudent, getAllStudents, getStudentByID, updateStudent } from "../controllers/students.controller";
import { isStudentExist, validateStudent, validateUpdateStudentBody } from "../middlewares/student.middleware";
import { auth } from "../middlewares/auth.middleware";

let router = Router();

router.get("/", auth, getAllStudents)

router.get("/:studentID", auth, getStudentByID)

router.post("/", validateStudent, createStudent)

router.patch("/:studentID", isStudentExist, validateUpdateStudentBody, updateStudent)

router.delete("/:studentID", isStudentExist, deleteStudent)

router.delete("/", deleteAllStudents)

export { router as studentsRouter };