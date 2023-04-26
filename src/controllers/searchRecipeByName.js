//Variables de entorno
require("dotenv").config();
const { API_KEY } = process.env;
//API URL
const API_URL = require("../../api-url");
//Base de datos
const { Recipe } = require("../db.js");
//Sequelize
const { Op } = require("sequelize");
//Axios
const axios = require("axios");
//Helper
const specifyResults = require("../helper/specifyResults");

/**************** CONTROLADOR PARA "/name" ****************/

const searchRecipeByName = async (search) => {
  try {
    if (!search) throw new Error("No se ingreso un valor a buscar");

    const response_API = await axios.get(
      `${API_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${search}&addRecipeInformation=true&number=100`
    );

    const response_DB = await Recipe.findAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });

    let data_DB = response_DB.map((Recipe) => {
      let modifyObj = {
        ...Recipe.dataValues,
        title: Recipe.dataValues.name,
      };
      delete modifyObj.name;
      return modifyObj;
    });

    let data_API = specifyResults(response_API.data.results);
    data_API = data_API.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        diets: recipe.diets.join(" - "),
        healthScore: recipe.healthScore,
      };
    });
    return [...data_API, ...data_DB];
  } catch (error) {
    throw new Error(
      `Error al buscar la receta con el nombre ${search}: ${error.message}`
    );
  }
};

module.exports = searchRecipeByName;
