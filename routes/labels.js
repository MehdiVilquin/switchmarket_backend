const express = require("express")
const router = express.Router()

const labelController = require("../controllers/labelController")

// Route : GET /labels - renvoie la liste de tous les labels
router.get("/", labelController.getLabels)


module.exports = router
