import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { CookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";

const router = Router();

router.post("/", SpecialtyController.createSpecialty);
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const accessToken = CookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No access token provided.");
        }

        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
        }

        if (verifiedToken.data!.role !== "ADMIN") {
            throw new AppError(status.FORBIDDEN, "Forbidden access! you do not have permission to access this resource.")
        }

        next()        
    } 
    catch (error: any) {
        next(error)
    }

},SpecialtyController.getAllSpecialties);
router.delete("/:id", SpecialtyController.deleteSpecialty);
router.patch("/:id", SpecialtyController.patchSpecialty);

export const SpecialtyRoutes = router;