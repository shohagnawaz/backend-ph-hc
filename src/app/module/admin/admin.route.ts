import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";

const router = Router();

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AdminController.getAllAdmins
);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AdminController.getAdminById
);

router.patch("/", checkAuth(Role.SUPER_ADMIN),
    validateRequest(updateAdminZodSchema),
    AdminController.updateAdmin
);

router.delete("/", checkAuth(Role.SUPER_ADMIN),
    AdminController.deleteAdmin
);

export const AdminRoutes = router;