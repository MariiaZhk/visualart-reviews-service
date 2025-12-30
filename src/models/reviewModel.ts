import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  artworkId: string;
  author: string;
  content: string;
  rating: number;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  artworkId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: () => new Date() },
});

export const Review = model<IReview>("Review", reviewSchema);
