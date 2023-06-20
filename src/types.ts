export interface Recipe {
  title: string,
  ingredients: string[],
  equipment: string[],
  duration: number | null,
  guide: string,
  id: number,
  imgUrl: string,
  description: string | null
}