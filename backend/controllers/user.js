// Contient la logique métier concernant les utilisateurs, à appliquer aux différentes routes CRUD (ici uniquement POST)

const User = require('../models/user'); // On fait appel à notre modèle 'user'
const brcrypt = require('bcrypt'); // On fait appel à Bcrypt pour hasher le mot de passe
const jsonWebToken = require('jsonwebtoken'); // On fait appel à JsonWebToken pour attribuer un TOKEN à un utilisateur quand il se connecte


exports.signup = (req, res, next) => { // Création nouvel utilisateur
    brcrypt.hash(req.body.password, 10) // Le chiffre '10' indique le nombre de salage du MDP
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

exports.login = (req, res, next) => { // Connection à un compte déjà existant
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
                    'hLq^hNoHp{Vw)c`HWHGwAq#vm&)1nX', // clé d'encodage
                    { expiresIn: '24h'} // Date d'expiration du TOKEN
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};