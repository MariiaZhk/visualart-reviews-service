import { Router } from "express";
import {
  createReview,
  getReviews,
  getReviewCounts,
} from "../controllers/reviewsController";

const router = Router();

router.post("/", createReview);
router.get("/", getReviews);
router.post("/_counts", getReviewCounts);

export default router;
