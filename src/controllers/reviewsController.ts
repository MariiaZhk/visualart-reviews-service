import { Request, Response, NextFunction } from "express";
import {
  createReviewService,
  getReviewsService,
  getCountsService,
} from "../services/reviewsService";
import {
  CreateReviewDto,
  GetReviewsQuery,
  GetCountsDto,
} from "../types/review";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { artworkId, author, content, createdAt } =
      req.body as CreateReviewDto;

    if (!artworkId || !author || !content) {
      return res
        .status(400)
        .json({ message: "artworkId, author and content are required" });
    }

    const saved = await createReviewService({
      artworkId,
      author,
      content,
      createdAt,
    });
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      artworkId,
      size = "10",
      from = "0",
    } = req.query as unknown as GetReviewsQuery;

    if (!artworkId)
      return res.status(400).json({ message: "artworkId is required" });

    const limit = parseInt(size, 10);
    const skip = parseInt(from, 10);

    const reviews = await getReviewsService(artworkId, skip, limit);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getReviewCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { artworkIds } = req.body as GetCountsDto;

    if (!Array.isArray(artworkIds)) {
      return res.status(400).json({ message: "artworkIds must be an array" });
    }

    const counts = await getCountsService(artworkIds);
    res.json(counts);
  } catch (err) {
    next(err);
  }
};
