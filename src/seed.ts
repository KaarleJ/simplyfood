const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  },
});


export async function seedDatabase() {
  const { id } = await prisma.user.create({
    data: {
      email: 'tester@test.com',
      name: 'Tester',
      avatarUrl: 'https://avatars.githubusercontent.com/u/117437182?v=4',
    },
  });

  await prisma.recipe.createMany({
    data: [
      {
        authorId: id,
        title: 'Spring Rolls',
        ingredients: [
          'rice paper',
          'carrots',
          'cabbage',
          'soy Sauce',
          'oil',
          'garlic',
          'minced meat',
        ],
        equipment: ['kettle', 'pan'],
        duration: 120,
        imgUrl:
          'https://firebasestorage.googleapis.com/v0/b/simplyfoodfiles.appspot.com/o/images%2Fspringrolls.jpg?alt=media&token=9119ad6e-4e36-4028-9d8e-c324482503fd',
        description:
          'Small recipe to create crispy spring rolls in my mothers style',
        guide:
          'Mince the garlic. Grate or chop the carrots into really small pieces. Heat the kettle and add oil. Add the garlic and carrot to the kettle. Sweat the vegetables. Add the minced meat and sear it. Add soy sauce and cook the mix in low heat for 10-20 min. Let the mix cool down a bit. Lay the rice paper on a flat surface. Place a spoonful of the mix on to the paper and start folding. Once you are done with folding. Heat the pan and add oil to it. Fry the folded rolls until golden brown. After frying let them cool down a bit and enjoy!',
      },
      {
        authorId: id,
        title: 'Pasta Carbonara',
        ingredients: [
          'spaghetti',
          'bacon',
          'egg yolks',
          'Parmesan cheese',
          'garlic',
          'black pepper',
          'salt',
        ],
        equipment: ['pot', 'skillet'],
        duration: 30,
        imgUrl:
          'https://firebasestorage.googleapis.com/v0/b/simplyfoodfiles.appspot.com/o/images%2Fcarbonara.jpg?alt=media&token=24408a5c-57ef-4598-aa7a-7c27a9701962',
        description: 'Classic Italian pasta dish with a creamy egg-based sauce',
        guide:
          'Cook the spaghetti according to the package instructions. In a skillet, cook the bacon until crispy. Remove the bacon from the skillet and set it aside. In a bowl, whisk together the egg yolks, grated Parmesan cheese, minced garlic, black pepper, and salt. Drain the cooked spaghetti and add it to the skillet with the bacon fat. Pour the egg mixture over the spaghetti and toss quickly to coat the pasta evenly. The heat from the spaghetti will cook the eggs and create a creamy sauce. Serve the pasta carbonara with additional grated Parmesan cheese and black pepper on top.',
      },
      {
        authorId: id,
        title: 'Chicken Curry',
        ingredients: [
          'chicken thighs',
          'onion',
          'garlic',
          'ginger',
          'curry powder',
          'coconut milk',
          'tomatoes',
          'coriander leaves',
        ],
        equipment: ['pot', 'pan'],
        duration: 45,
        imgUrl:
          'https://firebasestorage.googleapis.com/v0/b/simplyfoodfiles.appspot.com/o/images%2Fchickencurry.jpg?alt=media&token=0e997b28-7557-4253-9330-9ffca8598b5d',
        description:
          'Flavorful and aromatic chicken curry with a creamy coconut milk base',
        guide:
          'Heat oil in a pot and sauté chopped onion until golden brown. Add minced garlic and ginger, and cook for a minute. Stir in curry powder and cook until fragrant. Add chicken thighs and brown them on all sides. Pour in coconut milk and diced tomatoes. Simmer for about 30 minutes or until the chicken is cooked through and tender. Garnish with fresh coriander leaves before serving. Serve the chicken curry with rice or naan bread.',
      },
      {
        authorId: id,
        title: 'Caprese Salad',
        ingredients: [
          'tomatoes',
          'mozzarella cheese',
          'fresh basil leaves',
          'extra virgin olive oil',
          'balsamic vinegar',
          'salt',
          'black pepper',
        ],
        equipment: ['knife', 'cutting board', 'salad bowl'],
        duration: 15,
        imgUrl:
          'https://firebasestorage.googleapis.com/v0/b/simplyfoodfiles.appspot.com/o/images%2Fcapresesalad.jpg?alt=media&token=e0089879-f3a2-463c-a21c-614e7ebb3e05',
        description:
          'A simple and refreshing Italian salad with tomatoes, mozzarella, and basil',
        guide:
          'Slice the tomatoes and mozzarella cheese into thick slices. Arrange them alternately on a serving platter or in a salad bowl. Tuck fresh basil leaves between the tomato and mozzarella slices. Drizzle with extra virgin olive oil and balsamic vinegar. Season with salt and black pepper to taste. Let the salad sit for a few minutes to allow the flavors to meld together. Serve the Caprese salad as a starter or a light summer meal.',
      },
      {
        authorId: id,
        title: 'Chocolate Chip Cookies',
        ingredients: [
          'butter',
          'granulated sugar',
          'brown sugar',
          'eggs',
          'vanilla extract',
          'all-purpose flour',
          'baking soda',
          'salt',
          'chocolate chips',
        ],
        equipment: ['mixing bowl', 'electric mixer', 'baking sheet'],
        duration: 30,
        imgUrl:
          'https://firebasestorage.googleapis.com/v0/b/simplyfoodfiles.appspot.com/o/images%2Fchocolatecookies.jpg?alt=media&token=a378fc67-4697-463d-a125-a83fc23055c1',
        description:
          'Classic homemade chocolate chip cookies that are soft and chewy',
        guide:
          'Preheat the oven to 375°F (190°C). In a mixing bowl, cream together the softened butter, granulated sugar, and brown sugar until light and fluffy. Beat in the eggs one at a time, then stir in the vanilla extract. In a separate bowl, whisk together the all-purpose flour, baking soda, and salt. Gradually add the dry ingredients to the wet ingredients and mix until just combined. Fold in the chocolate chips. Drop rounded tablespoons of dough onto an ungreased baking sheet. Bake for 8 to 10 minutes or until lightly golden brown around the edges. Allow the cookies to cool on the baking sheet for a few minutes, then transfer them to a wire rack to cool completely. Enjoy the homemade chocolate chip cookies with a glass of milk!',
      },
    ]
  });
}

if (require.main === module) {
  seedDatabase()
    .catch((error) => {
      console.error(error);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
