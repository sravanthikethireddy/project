module.exports = function (app) {
    var userModel = require('./user/user.model.server')();
    var trackModel = require('./track/track.model.server')();
    var model = {
        userModel: userModel,
        trackModel: trackModel
    };
    return model;
};
