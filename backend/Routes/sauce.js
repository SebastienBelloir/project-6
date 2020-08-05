// Contient les fonctions qui s'appliquent aux différentes routes pour les sauces

const express = require('express'); // Nécessaire pour utiliser le router d'Express
const router = express.Router(); // On appelle le routeur d'Express pour pouvoir déporter notre logique de routing dans ce fichier
const sauceController = require('../controllers/sauce'); // Récupère les logiques métiers à appliquer à chaque route du CRUD
const auth = require('../middleware/auth'); // Récupère notre configuration d'authentification JsonWebToken
const multer = require('../middleware/multer-config'); // Récupère notre configuration 'multer' pour traitement des fichiers images

router.get('/', auth, sauceController.getAllSauces); // Route GET : suit le chemin '/', vérifie le token, fait appel à la logique pour récupérer toutes les sauces
router.post('/', auth, multer, sauceController.createSauce); // Route POST : suit le chemin '/', vérifie le token, applique multer pour l'ajout d'image, fait appel à la logique pour création de sauce
router.get('/:id', auth, sauceController.getOneSauce); // Route GET : suit le chemin '/:id', vérifie le token, fait appel à la logique pour récupérer la sauce en question
router.put('/:id', auth, multer, sauceController.modifySauce); // Route PUT : suit le chemin '/:id', vérifie le token, applique multer pour la modification de l'image, fait appel à la logique pour modification de sauce
router.delete('/:id', auth, sauceController.deleteSauce); // Route DELETE : suit le chemin '/:id', vérifie le token,  fait appel à la logique pour suppression de sauce
router.post('/:id/like', auth, sauceController.addLikeAndDislike); // Route POST : suit le chemin '/:id/like', vérifie le token, fait appel à la logique pour l'ajout d'un like/dislike d'une sauce

module.exports = router;