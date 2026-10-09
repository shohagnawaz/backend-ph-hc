import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { ReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";

const router = Router();

router.get("/", ReviewController.getAllReviews);

router.post("/", 
    checkAuth(Role.PATIENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.giveReview
);

router.get("/my-reviews", 
    checkAuth(Role.PATIENT, Role.DOCTOR),
    ReviewController.myReviews
);

router.patch("/:id", 
    checkAuth(Role.PATIENT), 
    validateRequest(ReviewValidation.updateReviewZodSchema),
    ReviewController.updateReview 
);

router.delete("/:id", 
    checkAuth(Role.PATIENT),
    ReviewController.deleteReview
);