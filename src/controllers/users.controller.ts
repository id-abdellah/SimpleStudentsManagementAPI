import { Request, Response } from "express";
import DB from "../config/db"
import { Jsend, JsendStatus } from "../utils/Jsend";
import { User } from "../@types/user";
import bcrypt from "bcrypt"
import { ColumnsSchema, filterColumns } from "../utils/dbUtils";
import jwt from "jsonwebtoken"

class UsersController {

    async getAllUsers(req: Request, res: Response) {
        // preaventing "password" column from being retreiving with data
        const [columns] = await DB.query("SHOW COLUMNS FROM users");
        const filteredCols = filterColumns(columns as ColumnsSchema[], ["password"])

        const [rows] = await DB.query(`SELECT ${filteredCols} FROM users`);
        res.send(new Jsend(JsendStatus.SUCCESS, rows))
    }

    async getUserById(req: Request<{ userID: number }>, res: Response) {
        const userID = +req.params.userID;
        const [rows] = await DB.query("SELECT * FROM users WHERE users.id = ?", [userID]);

        res.send(new Jsend(JsendStatus.SUCCESS, rows))
    }

    async register(req: Request<{}, {}, Omit<User, "id">>, res: Response) {
        const { email, password, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await DB.query("INSERT INTO users VALUES (DEFAULT, ?, ?, ?)", [username, email, hashedPassword]);
        res.status(201).send(new Jsend(JsendStatus.SUCCESS, req.body, "created successfuly"))
    }

    async login(req: Request<{}, {}, { email: string, password: string }>, res: Response) {
        const { email, password } = req.body;

        const [user] = await DB.query("SELECT * FROM users WHERE users.email = ?", [email]);

        if ((user as any[]).length == 0) {
            res.send("no users");
            return;
        };

        const dbPassword = (user as any[])[0].password;
        const isPasswordMatched = await bcrypt.compare(password, dbPassword);

        if (!isPasswordMatched) {
            res.status(401).send("invalid password")
            return;
        }

        const secretKey = process.env.JWT_SECRET_KEY as string;
        const token = jwt.sign({ email }, secretKey);

        res.send(`user logged in under toke: ${token}`)
    }
}


export default new UsersController();