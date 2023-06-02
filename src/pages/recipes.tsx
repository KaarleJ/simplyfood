import type { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/image"
import { Recipe } from "@/types"

const Recipes = ({ recipes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {
        recipes.map((recipe) => {
          return (
            <div key={recipe.id}>
              <Image src={recipe.imgUrl} width={500} height={500} alt="picture of recipe" />
              <h2 className="text-xl bold">{recipe.title}</h2>
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