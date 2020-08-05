// L'application en elle même qui va faire appelle aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route User, aux route Sauces


const express = require('express');
const bodyParser = require('body-parser'); // Pour faciliter le traitement des données contenues dans le corp de la reqûete, le transformant en objet JSON
const mongoose = require('mongoose'); // L'interface pour communiquer avec la BDD
const app = express();
const path = require('path'); // Pour le middleware express static pour acceder au chemin du système de fichier
const config = require('./config/config');
const helmet = require('helmet');
const sauceRoutes = require('./Routes/sauce');
const userRoutes = require('./Routes/user');
const { db } = require('./models/user');


mongoose.connect('mongodb+srv://' + config.user + ':' + config.password + '@cluster0-1qcor.mongodb.net/' + config.db + '?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // On donne l'accès à toute origine '*'
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // On donne l'autorisation d'utiliser ces headers sur l'objet réponse
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // On donne l'autorisation d'utiliser ces actions aux réponses
    next();
});

app.use(bodyParser.json());
app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images'))); //Va permettre à l'app de servir le dossier contenant les images, pour le middleware multer
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app; // L'application est exporté pour être 'servi' par le serveur