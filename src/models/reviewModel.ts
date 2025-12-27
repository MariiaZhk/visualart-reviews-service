import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  artworkId: string;
  author: string;
  content: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  artworkId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const Review = model<IReview>("Review", reviewSchema);
