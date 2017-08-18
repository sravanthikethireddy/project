module.exports = function (app, model) {
    var userModel = model.userModel;
    var trackModel = model.trackModel;

    var multer = require('multer'); // npm install multer --save
    var upload = multer({
        dest: __dirname + '/../../public/uploads'
    });

    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.post("/api/upload/track", upload.array('myFile'), uploadTrack);

    function uploadImage(req, res) {

        // var widgetId      = req.body.widgetId;
        // var myFile        = req.file;
        //
        // var originalname  = myFile.originalname; // file name on user's computer
        // var filename      = myFile.filename;     // new file name in upload folder
        // var path          = myFile.path;         // full path of uploaded file
        // var destination   = myFile.destination;  // folder where file is saved to
        // var size          = myFile.size;
        // var mimetype      = myFile.mimetype;
        //
        // widget = {};
        // widget.url = '/assignment/graduate/uploads/'+filename;
        //
        // var callbackUrl   = "/assignment/graduate/index.html#!/widget/345";
        //
        // res.redirect(callbackUrl);

        var userId = req.user._id;
        var myFile = req.file;

        var originalname = myFile.originalname; // file name on user's computer
        var filename = myFile.filename;     // new file name in upload folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;

        userModel
            .findUserById(userId)
            .then(function (user) {
                user.photo = '/uploads/' + filename;

                return userModel
                    .updateProfile(user);
            })
            .then(function (user) {
                res.redirect('/#/profile');
            }, function (err) {
                // res.status(500).send('Something broke!')
                res.sendStatus(500).send(err);

            });
    }

    function uploadTrack(req, res) {

        var userId = req.user._id;
        var myFiles = req.files;

        var trackname = myFiles[1].filename;     // new file name in upload folder
        var imagename = myFiles[0].filename;     // new file name in upload folder
        var track = {
            title: req.body.title,
            image: '/uploads/' + imagename,
            artist: req.user._id,
            url: '/uploads/' + trackname,
            wiki: {
                summary: req.body.summary
            }
        };
        trackModel
            .createTrack(track)
            .then(function (t) {
                res.redirect('/#/mylists');
            }, function (err) {
                // res.status(500).send('Something broke!')
                res.sendStatus(500).send(err);

            });
    }

};