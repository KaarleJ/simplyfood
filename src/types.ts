export interface Recipe {
  title: string,
  ingredients: string[],
  equipment: string[] | undefined,
  duration: number | undefined,
  guide: string,
  id: number,
  imgUrl: string
}