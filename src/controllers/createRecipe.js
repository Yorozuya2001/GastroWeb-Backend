const { Recipe, Diets } = require("../db");

const createRecipe = async ({
  name,
  image,
  summary,
  healthScore,
  analyzedInstructions,
  diets,
}) => {
  try {
    console.log("Create recipe", {
      name,
      image,
      summary,
      healthScore,
      analyzedInstructions,
      diets,
    });
    const newRecipe = await Recipe.create({
      name,
      image,
      summary,
      healthScore,
      analyzedInstructions,
    });

    // Relacionamos las dietas con la receta creada
    await Promise.all(
      diets.map(async (diet) => {
        console.log(diet);
        const [newDiet, created] = await Diets.findOrCreate({
          where: { name: diet },
        });

        await newRecipe.addDiet(newDiet);
      })
    );

    return newRecipe;
  } catch (error) {
    throw error; // Re-lanzamos el error para que lo maneje el middleware de error
  }
};

module.exports = createRecipe;
