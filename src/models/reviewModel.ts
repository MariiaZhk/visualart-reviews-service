import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  artworkId: string;
  author: string;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    artworkId: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

reviewSchema.index({ artworkId: 1, createdAt: -1 });

export const Review = model<IReview>("Review", reviewSchema);
