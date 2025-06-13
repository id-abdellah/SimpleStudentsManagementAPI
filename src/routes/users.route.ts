import { Router } from "express";
import UsersController from "../controllers/users.controller"
import { validateLoginBody, validateUserBody } from "../middlewares/user.middleware";

let router = Router();

router.get("/", UsersController.getAllUsers);
router.get("/:userID", UsersController.getUserById);
router.post("/", validateUserBody, UsersController.register)
router.post("/login", validateLoginBody, UsersController.login)

export { router as usersRouter };