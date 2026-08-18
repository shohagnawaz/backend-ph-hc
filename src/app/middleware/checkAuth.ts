import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";

export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {}
};