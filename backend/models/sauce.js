// Schema de données pour nos Sauces

const mongoose =require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    userId: { type: String, required: true },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    likes: { type: Number },
    dislikes: { type: Number }, 
});

module.exports = mongoose.model('Sauce', sauceSchema);