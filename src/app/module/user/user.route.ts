import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/create-doctor", UserController.createDoctor);
// router.post("/crate-admin", UserController.createDoctor);
// router.post("/crate-superAdmin", UserController.createDoctor);

export const UserRoutes = router;