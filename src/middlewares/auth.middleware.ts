import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export async function auth(req: Request<any>, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send("unAuthorized")
        return;
    }

    const token = authorization.split(" ")[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        next()
    } catch (error) {
        res.status(401).send(String(error));
    }
}