'use client';
import { Recipe } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import Text from '@/components/Text';
import { Like } from 'styled-icons/boxicons-regular';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

const RecipeCard = ({ recipe, className }: RecipeCardProps) => {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className={`shadow-lg bg-off-white text-stone-700 hover:text-cyan-700 hover:brightness-90 transition-all ${className}`}
    >
      <Image
        src={recipe.imgUrl}
        alt={`Picture of ${recipe.title}`}
        width={400}
        height={300}
        className="object-cover w-full h-48"
      />
      <div className="flex flex-row justify-between">
        <Text className="text-xl p-2 text-ellipsis">{recipe.title}</Text>
        <div className="flex flex-row justify-center">
          <Text className="text-md mt-2 font-medium">{recipe.likeCount}</Text>
          <Like className="w-6 h-6 ml-1 my-2 mr-2" />
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;