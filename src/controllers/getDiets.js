require("dotenv").config();
const axios = require("axios");
const API_URL = require("../../api-url");
const { API_KEY } = process.env;
const { Diets } = require("../db");

const getDiets = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
    );
    let getDiets = [];
    const { results } = response.data;

    results.forEach((element) => {
      getDiets = [...getDiets, ...element.diets];
    });

    const setDiets = new Set(getDiets);

    const allDiets = [...setDiets];

    await Diets.bulkCreate(
      allDiets.map((diet) => ({ name: diet })),
      { ignoreDuplicates: false }
    );

    const alldata = await Diets.findAll();
    return alldata;
  } catch (error) {
    throw new Error(`Error al crear los registros: ${error.message}`);
  }
};

module.exports = getDiets;
