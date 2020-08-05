// Contient la logique métier concernant les sauces, à appliquer aux différentes routes CRUD

const Sauce = require('../models/sauce'); // Récupération du modèle 'Sauce'
const fs = require('fs'); // Récupération du module 'file system' de Node


exports.createSauce = (req, res, next) => { // route POST => Création d'une sauce
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // route READ => afficher une sauce en particulier
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => { // route PUT => modification d'une sauce
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => { // route DELETE => suppression d'une sauce
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => { // route READ => afficher toutes les sauces
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.addLikeAndDislike = (req, res, next) => { // route POST => ajout/suppression d'un like/dislike à une sauce
    const user = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    if (like === 1) { // Si il s'agit d'un like
        Sauce.updateOne(
            {_id: sauceId},
            {
            $push: {usersLiked: user},
            $inc: {likes: like}
            }
        )
        .then(() => res.status(200).json({ message: 'Like ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    }

    

    if (like === -1) { // Si il s'agit d'un dislike
        Sauce.updateOne(
            {_id: sauceId},
            {
                $push: {usersDisliked: user},
                $inc: {dislikes: -like}
                }
        )
        .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    }
    if (like === 0) { // Annulation like ou dislike
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(user)) { 
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersLiked: user },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Like retiré !' }))
            .catch((error) => res.status(400).json({ error }))
        }
        if (sauce.usersDisliked.includes(user)) { 
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: user },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }
};