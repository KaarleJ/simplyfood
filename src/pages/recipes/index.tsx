import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { Recipe } from "@/types"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const Recipes = ({ recipes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query) {
      router.push(`recipes?search=${encodeURIComponent(query)}`)
    } else {
      router.push('/recipes')
    }
    setQuery('')
  }

  return (
    <>
      <form onSubmit={handleSearch} className="flex justify-end">
        <input
          className="border border-stone-400 rounded-md px-2 py-1 text-stone-500 text-sm"
          type="text"
          placeholder="search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        >
        </input>
        <button
          type="submit"
          className="px-2 py-1 mx-1 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all mr-4"
        >
          search
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 m-4">
        {
          recipes.map((recipe) => {
            return (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="shadow-lg h-full w-full bg-off-white text-stone-700 hover:text-cyan-700 hover:brightness-90 transition-all">
                <Image src={recipe.imgUrl} alt={`Picture of ${recipe.title}`} width={400} height={300} className="object-cover w-full h-48" />
                <h2 className="text-lg p-2 font-medium">{recipe.title}</h2>
              </Link>
            )
          })
        }
      </div>
    </>
  )
}

export default Recipes

export const getServerSideProps: GetServerSideProps<{ recipes: Recipe[] }> = async (context) => {
  const searchQuery = context.query.search as string
  
  try {
    let recipes: Recipe[];
    if (searchQuery) {
      recipes = await prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
      });
    } else {
      recipes = await prisma.recipe.findMany();
    }
    return {
      props: {
        recipes: JSON.parse(JSON.stringify(recipes))
      }
    }
  } catch (error) {
    console.log(error);
    
    return {
      notFound: true
    }
  } finally {
    await prisma.$disconnect()
  }
}