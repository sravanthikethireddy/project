module.exports = function () {
    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({
        firstName: String,
        role: {type: String, enum: ['ADMIN', 'ARTIST', 'USER'], default: 'USER'},
        username: {type: String, unique: true},
        password: String,
        lastName: String,
        photo: String,
        external: Boolean,
        email: String,
        dateCreated: {type: Date, default: Date.now},
        mozzieId: {type: String, unique: true, sparse: true},
        google: {
            id: String
        },
        facebook: {
            id: String
        },
        messages: [{
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieUser'},
            track: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieTrack'},
            // track: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieTrack'},
            // track: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieTrack'},
            // track: {type: mongoose.Schema.Types.ObjectId, ref: 'MozzieTrack'},
            read: {type: Boolean, default: false},
            dateCreated: {type: Date, default: Date.now}
        }],
        favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'MozzieTrack'}]
    }, {collection: 'mozzie.user'});

    return userSchema;
};