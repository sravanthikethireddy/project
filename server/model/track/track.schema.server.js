module.exports = function () {
    var mongoose = require('mongoose');

    var trackSchema = mongoose.Schema({
        title: String,
        url: String,
        image: String,
        favs: [{type: mongoose.Schema.Types.ObjectId, ref: 'MozzieUser'}],
        artist: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieUser'},
        dateCreated: {type: Date, default: Date.now},
        mbid: {type: String, unique: true, sparse: true},
        tags: [{type: String}],
        wiki: {summary: String, published: {type: Date, default: Date.now()}},
        playCount: Number,
        listenersCount: Number,
        comments: [{
            comment: String,
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieUser'},
            dateCreated: {type: Date, default: Date.now}
        }]
    }, {collection: 'mozzie.track'});

    return trackSchema;
};