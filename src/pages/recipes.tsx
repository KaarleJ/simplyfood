import type { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/image"
import { Recipe } from "@/types"

const Recipes = ({ recipes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="grid grid-cols-2 gap-4 m-4">
      {
        recipes.map((recipe) => {
          return (
            <div key={recipe.id} className="bg-off-white shadow-lg h-full w-full">
              <div className="relative m-4 p-4">
               <Image src={recipe.imgUrl} fill objectFit="contain" alt={`Picture of ${recipe.title}`} />
              </div>
              <h2 className="text-xl mx-5 my-2 text-gray">{recipe.title}</h2>
            </div>
          )
        })
      }
    </div>
  )
}

export default Recipes

export const getStaticProps: GetStaticProps<{ recipes: Recipe[] }> = async () => {
  const res = await fetch('http://localhost:4000/recipes')
  const recipes: Recipe[] = await res.json()
  if (!recipes) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      recipes
    },
    revalidate: 10
  }
}