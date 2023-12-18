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
  authorId?: number | null | undefined;
  authorName?: string | null | undefined;
}
