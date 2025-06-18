import { Router } from "express";
import UsersController from "../controllers/users.controller"
import { validateLoginBody, validateUserBody } from "../middlewares/user.middleware";
import multer, { FileFilterCallback } from "multer";

let router = Router();

/**
 * Multer
 */
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const ext = file.mimetype.split("/")[1];
        const filename = `user-${Date.now()}.${ext}`;
        callback(null, filename);
    },
})

const fileFilter: multer.Options["fileFilter"] = (req, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const fileType = file.mimetype.split("/")[0];
    if (fileType === "image") {
        callback(null, true)
    } else {
        callback(new Error("Must be image file"))
    }
}

const upload = multer({ storage: storage, fileFilter })

/**
 * Routes
 */

router.get("/", UsersController.getAllUsers);
router.get("/:userID", UsersController.getUserById);
router.post("/", upload.single("avatar"), validateUserBody, UsersController.register)
router.post("/login", validateLoginBody, UsersController.login)

export { router as usersRouter };