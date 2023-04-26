const { Recipe } = require("../db");

const validateRecipe = async (req, res, next) => {
  try {
    const { name, image, summary, healthScore, analyzedInstructions } =
      req.body;

    const existingRecipe = await Recipe.findOne({
      where: {
        name: name,
      },
    });

    if (existingRecipe)
      throw new Error(
        "The recipe was not loaded correctly because it already exists."
      );

    let errorMessage = "";

    if (!(name && typeof name === "string"))
      errorMessage += `El nombre ${name} de la receta que creaste es invalido.\n`;

    if (!(summary && typeof summary === "string"))
      errorMessage += `El nombre ${summary} de la receta que creaste es invalido.\n`;

    if (isNaN(healthScore) || healthScore < 0 || healthScore > 100)
      errorMessage += `La puntuación de salud "${healthScore}" de la receta que creaste es invalido.\n`;

    if (!(analyzedInstructions && typeof analyzedInstructions === "string"))
      errorMessage += `Las instrucciones "${analyzedInstructions}" de la receta que creaste es invalido.\n`;

    if (errorMessage) {
      throw new Error(errorMessage);
    } else {
      next();
    }
  } catch (error) {
    console.log("Error ", error);
    res.status(400).send({ message: error.message, status: false });
  }
};

module.exports = validateRecipe;
