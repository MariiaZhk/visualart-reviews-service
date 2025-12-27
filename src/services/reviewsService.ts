import { Review, IReview } from "../models/reviewModel";

export const createReviewService = async (data: Partial<IReview>) => {
  const review = new Review(data);
  return review.save();
};

export const getReviewsService = async (
  artworkId: string,
  skip = 0,
  limit = 10
) => {
  return Review.find({ artworkId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const getCountsService = async (artworkIds: string[]) => {
  const counts = await Review.aggregate([
    { $match: { artworkId: { $in: artworkIds } } },
    { $group: { _id: "$artworkId", count: { $sum: 1 } } },
  ]);

  const result: Record<string, number> = {};
  artworkIds.forEach((id) => {
    const c = counts.find((x) => x._id === id);
    result[id] = c ? c.count : 0;
  });
  return result;
};
