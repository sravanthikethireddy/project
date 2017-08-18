module.exports = function (app) {
    var model = require("./model/models.server")(app);
    require("./services/user.service.server")(app, model);
    require("./services/music.service.server")(app, model);
    require("./services/upload.service.server.js")(app, model);
};