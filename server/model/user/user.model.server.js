module.exports = function (model) {
    var q = require('q');
    var mongoose = require('mongoose');
    var userSchema = require('./user.schema.server')();
    var userModel = mongoose.model('MozzieUser', userSchema);
    var api = {
        createUser: createUser,
        searchUsers: searchUsers,
        getFavorites: getFavorites,
        addMessage: addMessage,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUserByGoogleId: findUserByGoogleId,
        findUserByfbId: findUserByfbId,
        findUserById: findUserById,
        findUserByMozzieId: findUserByMozzieId,
        getMessages: getMessages,
        addTrack: addTrack,
        updateProfile: updateProfile,
        // updateUser:updateUser,
        deleteTrack: deleteTrack,
        findAllUsers: findAllUsers,
        findAllArtists: findAllArtists,
        deleteMessage: deleteMessage,
        deleteUser: deleteUser
    };
    return api;
    // function createUser(user) {
    //     return userModel.create(user);
    // }
    function createUser(user) {
        var deferred = q.defer();
        userModel
            .create(user, function (drop, user) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function searchUsers(searchWord) {
        var deferred = q.defer();
        userModel
            .find({
                    $or: [{username: {"$regex": searchWord, "$options": "i"}},
                        {firstName: {"$regex": searchWord, "$options": "i"}},
                        {lastName: {"$regex": searchWord, "$options": "i"}}],
                    role: 'USER'
                },
                function (drop, users) {
                    if (drop) {
                        deferred.abort(drop);
                    } else {
                        deferred.resolve(users);
                    }
                });
        return deferred.promise;
    }
    function getFavorites(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId)
            .populate({path: 'favorites', populate: {path: 'artist', select: 'mozzieId'}})
            .exec(function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    deferred.resolve(user.favorites);
                }
            });
        return deferred.promise;
    }
    function findAllArtists() {
        var deferred = q.defer();
        userModel
            .find({role: 'ARTIST'}, function (drop, users) {
                if (drop)
                    deferred.reject(drop);
                else {
                    deferred.resolve(users);
                }
            });
        return deferred.promise;
    }
    function addMessage(userId, message) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    user.messages.push(message);
                    user.save();
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function findUserByUsername(username) {
        var deferred = q.defer();
        userModel
            .findOne({username: username}, function (drop, user) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    // function findUserByCredentials(username, password) {
    //     return userModel.findOne({username: username, password: password});
    // }
    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        userModel
            .findOne({username: username, password: password}, function (drop, user) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function findUserByGoogleId(googleId) {
        return userModel.findOne({
            'google.id': googleId
        });
    }function findUserByfbId(fbId) {
        return userModel.findOne({
            'fb.id': fbId
        });
    }
    // function findUserById(userId) {
    //     return userModel
    //         .findById(userId)
    //         .populate('websites', 'name');
    // }
    function findUserById(userId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function findUserByMozzieId(mozzieId) {
        var deferred = q.defer();
        userModel
            .findOne({mozzieId: mozzieId}, function (drop, user) {
                if (drop) {
                    deferred.reject(drop);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function getMessages(userId) {
        var deferred = q.defer();
        userModel
            .findOne(userId)
            .populate({path: 'messages.user messages.track', select: 'firstName lastName title mbid'})
            .exec(function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    deferred.resolve(user.messages);
                }
            });
        return deferred.promise;
    }
    function addTrack(userId, trackId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    user.favorites.push(trackId);
                    user.save();
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function updateProfile(user) {
        return userModel.update({_id: user._id},
            {
                $set: {
                    firstName: user.firstName,
                    photo: user.photo,
                    email: user.email,
                    lastName: user.lastName
                }
            });
    }
    function findAllUsers() {
        return userModel.find();
    }
    function deleteMessage(userId, message) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    for (var msg in user.messages) {
                        if ((user.messages[msg].track === message.track._id) && (user.messages[msg].user === message.user._id)) {
                            user.messages[msg].read = true;
                            user.save();
                        }
                    }
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
    function deleteUser(userId) {
        var deferred = q.defer();
        userModel
            .remove({_id: userId}, function (drop, status) {
                if (drop) {
                    deferred.abort(drop);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
    function deleteTrack(userId, trackId) {
        var deferred = q.defer();
        userModel
            .findById(userId, function (drop, user) {
                if (drop)
                    deferred.reject(drop);
                else {
                    for (var faa in user.favorites) {
                        if (user.favorites[faa] === trackId) {
                            user.favorites.splice(faa, 1);
                            user.save();
                        }
                    }
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

};