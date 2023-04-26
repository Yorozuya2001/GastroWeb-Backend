const { Diets } = require("../db");

const verifyDietsInDB = async (req, res, next) => {
  const data = await Diets.findAll();

  data[0] ? res.status(200).json(data) : next();
};

module.exports = verifyDietsInDB;
