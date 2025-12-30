export interface CreateReviewDto {
  artworkId: string;
  author: string;
  content: string;
  rating: number;
}

export interface GetReviewsQuery {
  artworkId: string;
  size?: string;
  from?: string;
}

export interface GetCountsDto {
  artworkIds: string[];
}
