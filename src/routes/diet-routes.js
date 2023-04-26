const { Router } = require("express");
//Controllers;
const getDiets = require("../controllers/getDiets");
//Middlewares
const verifyDietsInDB = require("../middlewares/verifyDietsInDB");

const router = Router();

router.get("/", verifyDietsInDB, async (req, res) => {
  try {
    const data = await getDiets();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
