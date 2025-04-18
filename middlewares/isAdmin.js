// Middleware pour vérifier si l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
    // L'utilisateur doit déjà être authentifié (middleware auth appliqué avant)
    if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" })
    }

    // Vérifier si l'utilisateur a le rôle d'administrateur
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé. Vous n'avez pas les droits d'administrateur." })
    }

    // Si l'utilisateur est un administrateur, continuer
    next()
}

module.exports = isAdmin
