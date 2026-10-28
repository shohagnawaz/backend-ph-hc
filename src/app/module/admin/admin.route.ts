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

router.patch("/change-user-status",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN), 
    AdminController.changeUserStatus
);

router.patch("/change-user-role",
    checkAuth(Role.SUPER_ADMIN),
    AdminController.changeUserRole
);

export const AdminRoutes = router;