import { Review } from "../models/reviewModel";

export const createReviewService = async (data: {
  artworkId: string;
  author: string;
  content: string;
  rating: number;
}) => {
  const review = new Review(data);
  return review.save();
};

export const getReviewsService = async (
  artworkId: string,
  skip: number,
  limit: number
) => {
  return Review.find({ artworkId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const getCountsService = async (artworkIds: string[]) => {
  const result = await Review.aggregate([
    { $match: { artworkId: { $in: artworkIds } } },
    { $group: { _id: "$artworkId", count: { $sum: 1 } } },
  ]);

  const counts: Record<string, number> = {};
  artworkIds.forEach((id) => (counts[id] = 0));
  result.forEach((r) => {
    counts[r._id] = r.count;
  });

  return counts;
};
