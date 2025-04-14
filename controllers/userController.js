exports.getMe = (req, res) => {
    const user = req.user;
    res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
    });
};
