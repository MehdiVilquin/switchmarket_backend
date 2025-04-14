const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_DURATION_DAYS = 30;

exports.register = async (req, res) => {
    const { username, email, password, firstname, lastname, birthdate } = req.body;
    if (!username || !email || !password || !firstname || !lastname || !birthdate) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(409).json({ message: 'Utilisateur déjà existant' });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, passwordHash, firstname, lastname, birthdate });
        await newUser.save();

        res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Champs requis' });
    }

    try {
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: `${TOKEN_DURATION_DAYS}d`,
        });

        const expiresAt = new Date(Date.now() + TOKEN_DURATION_DAYS * 24 * 60 * 60 * 1000);

        user.tokens.push({ value: token, expiresAt });
        await user.save();

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
