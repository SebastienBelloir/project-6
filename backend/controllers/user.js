const User = require('../models/user');
const brcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    brcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
        brcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({error: 'Mot de passe incorrect !'}); 
            }
            res.status(200).json({
                userId: user._id,
                token: jsonWebToken.sign(
                    { userId: user._id },
                    'hLq^hNoHp{Vw)c`HWHGwAq#vm&)1nX',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};