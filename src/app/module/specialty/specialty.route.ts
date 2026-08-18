import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", SpecialtyController.createSpecialty);
router.get("/", checkAuth(Role.PATIENT),SpecialtyController.getAllSpecialties);
router.delete("/:id", SpecialtyController.deleteSpecialty);
router.patch("/:id", SpecialtyController.patchSpecialty);

export const SpecialtyRoutes = router;