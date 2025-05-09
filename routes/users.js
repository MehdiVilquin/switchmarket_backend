const express = require("express")
const router = express.Router()

// Import des controllers authController et userController et du middleware auth
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")
const auth = require("../middlewares/auth")
const isAdmin = require("../middlewares/isAdmin")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", auth, userController.getMe)
router.put("/update", auth, userController.updateProfile)

router.get("/", auth, isAdmin, userController.getAllUsers)
router.delete("/:userId", auth, isAdmin, userController.deleteUser)

// Nouvelles routes pour la gestion des administrateurs
router.put("/promote/:userId", auth, isAdmin, userController.promoteToAdmin)
router.put("/demote/:userId", auth, isAdmin, userController.demoteToUser)

module.exports = router
