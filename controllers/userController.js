const User = require("../models/users")
const bcrypt = require("bcrypt")

exports.getMe = (req, res) => {
    const user = req.user
    res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        birthdate: user.birthdate,
    })
}

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, firstname, lastname, birthdate, currentPassword, newPassword } = req.body
        const userId = req.user._id

        // Vérifier si l'email ou le nom d'utilisateur est déjà utilisé par un autre utilisateur
        if (email !== req.user.email || username !== req.user.username) {
            const existingUser = await User.findOne({
                $and: [{ _id: { $ne: userId } }, { $or: [{ email }, { username }] }],
            })

            if (existingUser) {
                return res.status(409).json({
                    message:
                        existingUser.email === email ? "Cet email est déjà utilisé" : "Ce nom d'utilisateur est déjà utilisé",
                })
            }
        }

        // Préparer les données à mettre à jour
        const updateData = {
            username,
            email,
            firstname,
            lastname,
            birthdate,
        }

        // Si l'utilisateur souhaite changer son mot de passe
        if (currentPassword && newPassword) {
            // Vérifier que le mot de passe actuel est correct
            const isPasswordValid = await bcrypt.compare(currentPassword, req.user.passwordHash)

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Mot de passe actuel incorrect" })
            }

            // Hasher le nouveau mot de passe
            updateData.passwordHash = await bcrypt.hash(newPassword, 10)
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })

        res.status(200).json({
            message: "Profil mis à jour avec succès",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                birthdate: updatedUser.birthdate,
            },
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
