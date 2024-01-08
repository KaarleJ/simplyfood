export interface Recipe {
  title: string;
  ingredients: string[];
  equipment: string[];
  duration?: number | null | undefined;
  guide: string;
  id: number;
  imgUrl: string;
  description?: string | null | undefined;
  likeCount?: number | null | undefined;
  createdAt?: Date | null | undefined;
  avatarUrl?: string | null | undefined;
  authorId?: string | null | undefined;
  authorName?: string | null | undefined;
  likes?: number | null | undefined;
  comments?: Comment[] | null | undefined;
}

export interface Comment {
  id: number;
  recipeId: number;
  body: string;
  authorId: string;
  authorName: string;
  avatarUrl: string;
  createdAt: Date;
}