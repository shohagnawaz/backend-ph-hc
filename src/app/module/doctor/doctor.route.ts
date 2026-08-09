import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);
router.patch("/:id", DoctorController.updateDoctor);

export const DoctorRoutes = router;