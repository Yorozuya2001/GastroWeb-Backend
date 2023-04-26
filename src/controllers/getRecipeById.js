//Variables de entorno
require("dotenv").config();
const API_URL = require("../../api-url");
const { API_KEY } = process.env;
//Base de datos
const { Recipe } = require("../db.js");
//Libreria Axios
const axios = require("axios");

/**************** CONTROLADOR PARA "/:idRecipe" ****************/

const getRecipeById = async (idRecipe) => {
  try {
    let recipe = undefined;
    let dietsOfRecipe = undefined;

    isNaN(Number(idRecipe)) &&
      (recipe = await Recipe.findOne({ where: { id: idRecipe } }));

    if (recipe) {
      const diets = await recipe.getDiets();

      dietsOfRecipe = diets.map((diet) => diet.name);

      return {
        ...recipe.dataValues,
        diets: dietsOfRecipe[0] ? dietsOfRecipe.join(" - ") : "",
      };
    }

    const response = await axios.get(
      `${API_URL}/recipes/${idRecipe}/information?apiKey=${API_KEY}`
    );

    console.log(response.data);

    const {
      id,
      title,
      image,
      summary,
      healthScore,
      analyzedInstructions,
      diets,
    } = response.data;

    return {
      id,
      title,
      image,
      summary,
      healthScore,
      diets: diets[0] ? diets.join(" - ") : "",
      analyzedInstructions: analyzedInstructions[0]?.steps
        .map((recipeStep) => {
          return recipeStep.step;
        })
        .join(" "),
    };
  } catch (error) {
    throw new Error(
      `Error al obtener la receta con id ${idRecipe}: ${error.message}`
    );
  }
};

module.exports = getRecipeById;
