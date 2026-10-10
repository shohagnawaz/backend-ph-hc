import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { PrescriptionValidation } from "./prescription.validation";

const router = Router();

router.get("/",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    PrecriptionController.getAllPrescriptions
);

router.get("/my-prescriptions",
    checkAuth(Role.PATIENT),
    PrescriptionController.myPrescriptions
);

router.post("/",
    checkAuth(Role.DOCTOR),
    validateRequest(PrescriptionValidation.createPrescriptionZodSchema),
    PrescriptionController.givePrescription
);

router.patch("/:id",
    checkAuth(Role.DOCTOR),
    validateRequest(PrescriptionValidation.updatePrescriptionZodSchema),
    PrescriptionController.updatePrescription
);

router.delete("/:id",
    checkAuth(Role.DOCTOR),
    PrescriptionController.deletePrescription
);

export const prescriptionRouter = router;

