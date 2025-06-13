import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { User } from "../@types/user";

const userBodySchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string()
}).strict()

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
}).strict()


export async function validateUserBody(req: Request<{}, {}, Omit<User, "id">>, res: Response, next: NextFunction) {
    const body = req.body;
    const isValid = userBodySchema.safeParse(body)
    if (!isValid.success) {
        res.end(String(isValid.error))
        return;
    };
    next()
}

export async function validateLoginBody(req: Request<{}, {}, z.infer<typeof loginSchema>>, res: Response, next: NextFunction) {
    const body = req.body;
    const isValid = loginSchema.safeParse(body);
    if (!isValid.success) {
        res.send(String(isValid.error))
        return;
    };
    next()
}