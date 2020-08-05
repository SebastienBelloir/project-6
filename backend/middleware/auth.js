// Middleware qui vient vérifier le TOKEN à chaque emprunt d'une route 

const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ') [1]; // Récupération du token dans l'entête
        const decodedToken = jsonWebToken.verify(token, 'hLq^hNoHp{Vw)c`HWHGwAq#vm&)1nX'); // on vérifie le token avec la clé pour lire ce token
        const userId = decodedToken.userId; // Le token devient un objet JS classique qu'on place dans une constante, et on y récupère l'user ID pour comparaison le cas échéant
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' })
    }
}