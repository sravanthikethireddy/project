module.exports = function (model) {
    var q = require('q');
    var mongoose = require('mongoose');
    var trackSchema = require('./track.schema.server.js')();
    var trackModel = mongoose.model('MozzieTrack', trackSchema);

    var api = {
        createTrack: createTrack,
        findTrackByArtist: findTrackByArtist,
        getTrackDetails: getTrackDetails,
        addComment: addComment,
        addFav: addFav,
        deleteFav: deleteFav,
        findTrackById: findTrackById,
        findTrackBymbid: findTrackBymbid
    };
    return api;

    function createTrack(track) {
        var deferred = q.defer();
        trackModel
            .create(track, function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function findTrackByArtist(userId) {
        var deferred = q.defer();
        trackModel
            .find({artist: userId})
            .populate({path: 'artist', select: 'mozzieId'})
            .exec(function (drop, tracks) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(tracks);
                }
            });
        return deferred.promise;
    }

    function findTrackById(trackId) {
        var deferred = q.defer();
        trackModel
            .findById(trackId)
            .populate({path: 'artist comments.user', select: 'mozzieId firstName'})
            .exec(function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function findTrackBymbid(mbid) {
        var deferred = q.defer();
        trackModel
            .findOne({mbid: mbid},
                function (drop, track) {
                    if (drop) {
                        deferred.reject(drop);
                    } else {
                        deferred.resolve(track);
                    }
                });
        return deferred.promise;
    }

    function getTrackDetails(mbid) {
        var deferred = q.defer();
        trackModel
            .findOne({mbid: mbid})
            .populate({path: 'comments.user', select: 'firstName'})
            .exec(function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function addComment(trackId, comment) {
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    track.comments.push(comment);
                    track.save();
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function addFav(userId, trackId) {
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    track.favs.push(userId);
                    track.save();
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function deleteFav(userId, trackId) {
        var deferred = q.defer();
        trackModel
            .findById(trackId, function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    for (var fa in track.fave) {
                        if (track.favs[fa].equals(userId)) {
                            track.favs.splice(fa, 1);
                            track.save();
                            break;
                        }
                    }
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

    function getTrack(mbid) {
        var deferred = q.defer();
        trackModel
            .findOne({mbid: mbid}, function (drop, track) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(track);
                }
            });
        return deferred.promise;
    }

};