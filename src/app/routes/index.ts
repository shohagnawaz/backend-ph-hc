import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { scheduleRouter } from "../module/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";
import { PatientsRoute } from "../module/patient/patient.route";
import { PrescriptionRouter } from "../module/prescription/prescription.route";
import { ReviewRoutes } from "../module/review/review.route";
import { StatsRoutes } from "../module/stats/stats.route";
import { PaymentRoutes } from "../module/payment/payment.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRoutes);
router.use("/users", UserRoutes);
router.use("/patients", PatientsRoute)
router.use("/doctors", DoctorRoutes);
router.use("/admins", AdminRoutes);
router.use("/schedules", scheduleRouter);
router.use("/doctor-schedules", DoctorScheduleRoutes);
router.use("/appointment", AppointmentRoutes);
router.use("/prescriptions", PrescriptionRouter);
router.use("/review", ReviewRoutes);
router.use("/stats", StatsRoutes);
router.use("/payments", PaymentRoutes);

export const IndexRoutes = router;