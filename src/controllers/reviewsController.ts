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
import { checkArtworkExists } from "../clients/artworkClient";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { artworkId, author, content, rating } = req.body as CreateReviewDto;

    if (!artworkId || !author || !content || rating == null) {
      return res.status(400).json({
        message: "artworkId, author, content and rating are required",
      });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "rating must be a number between 1 and 5",
      });
    }

    const exists = await checkArtworkExists(artworkId);
    if (!exists) {
      return res.status(400).json({
        message: `Artwork with id ${artworkId} does not exist`,
      });
    }

    const saved = await createReviewService({
      artworkId,
      author,
      content,
      rating,
    });

    return res.status(201).json(saved);
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

    if (!artworkId) {
      return res.status(400).json({
        message: "artworkId is required",
      });
    }

    const limit = Number(size);
    const skip = Number(from);

    if (Number.isNaN(limit) || Number.isNaN(skip) || limit < 0 || skip < 0) {
      return res.status(400).json({
        message: "size and from must be positive numbers",
      });
    }

    const reviews = await getReviewsService(artworkId, skip, limit);
    return res.json(reviews);
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

    if (!Array.isArray(artworkIds) || artworkIds.length === 0) {
      return res.status(400).json({
        message: "artworkIds must be a non-empty array",
      });
    }

    const counts = await getCountsService(artworkIds);
    return res.json(counts);
  } catch (err) {
    next(err);
  }
};
