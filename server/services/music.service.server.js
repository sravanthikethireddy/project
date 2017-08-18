module.exports = function (app, model) {
    app.get('/api/track', findTrackBymbid);
    app.get('/api/track/:trackId', findTrackById);
    app.post('/api/track/:trackId/addComment', addComment);
    app.post('/api/track', getTrackDetails);
    app.get('/api/artistTrack/:artistId', findTrackByArtist);

    var userModel = model.userModel;
    var trackModel = model.trackModel;

    function findTrackBymbid(req, res) {
        trackModel
            .findTrackBymbid(req.query.mbid)
            .then(function (track) {
                res.json(track);
            }, function (err) {
                res.sendStatus(500);
            })
    }

    function findTrackById(req, res) {
        trackModel
            .findTrackById(req.params.trackId)
            .then(function (track) {
                res.json(track);
            }, function (err) {
                res.sendStatus(500);
            })
    }

    function addComment(req, res) {
        trackModel
            .addComment(req.params.trackId, req.body)
            .then(function (track) {
                res.json(track);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function findTrackByArtist(req, res) {
        trackModel
            .findTrackByArtist(req.params.artistId)
            .then(function (tracks) {
                res.json(tracks);
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }


    function getTrackDetails(req, res) {
        trackModel
            .getTrackDetails(req.body.mbid)
            .then(function (track) {
                if (track) {
                    res.json(track);

                } else {
                    userModel
                        .findUserByMozzieId(req.body.artist)
                        .then(function (user) {
                            if (user) {
                                return userModel.findUserByMozzieId(user.mozzieId)
                            } else {

                                user = {
                                    role: 'ARTIST',
                                    mozzieId: req.body.artist,
                                    username: req.body.artist + "@lastfm",
                                    external: true
                                };
                                return userModel
                                    .createUser(user)
                            }
                        })
                        .then(function (user) {
                            req.body.artist = user._id;
                            return trackModel
                                .createTrack(req.body)
                        }, function (err) {
                        })
                        .then(function (track) {
                            res.json(track);
                        }, function (err) {
                            res.sendStatus(500).send(err);
                        })
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            })
    }

    function createTrack(track) {
        userModel
            .findUserByMozzieId(track.artist)
            .then(function (user) {
                if (user) {
                    return userModel.findUserByMozzieId(user.mozzieId)
                } else {
                    user = {
                        mozzieId: track.artist,
                        firstName: track.artist,
                        external: true,
                        role: 'ARTIST'
                    };
                    return userModel
                        .createUser(user)
                }
            })
            .then(function (user) {
                track.artist = user._id;
                return trackModel
                    .createTrack(track)
            }, function (err) {
                res.sendStatus(500).send(err);
            })
            .then(function (track) {
                res.json(track);
            }, function (err) {

                res.sendStatus(500).send(err);
            })
    }

};