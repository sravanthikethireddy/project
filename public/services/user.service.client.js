(function () {
    angular
        .module("Mozzie")
        .factory("UserService", userService);

    function userService($http) {
        var currentUser = {messages: []};
        var noOfMsgs = {};
        var currentMenu={};

        var api = {
            "login": login,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "findUserByMozzieId": findUserByMozzieId,
            "findUserById": findUserById,
            "isAdmin": isAdmin,
            "isArtist": isArtist,
            "isLoggedin": isLoggedin,
            "getMessages": getMessages,
            "addMessage": addMessage,
            "deleteMessage": deleteMessage,
            "findAllUsers": findAllUsers,
            "findAllArtists": findAllArtists,
            "updateUser": updateUser,
            "updateCurrentUser": updateCurrentUser,
            "deleteUser": deleteUser,
            "updateProfile": updateProfile,
            "currentUser": currentUser,
            "noOfMsgs": noOfMsgs,
            "currentMenu":currentMenu,
            "addTrack": addTrack,
            "deleteTrack": deleteTrack,
            "getFavorites": getFavorites,
            "searchUsers": searchUsers,
            "register": register,
            "logout": logout
        };
        return api;

        function login(user) {
            return $http.post('/api/login', user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function findUserByMozzieId(mozzieId) {
            return $http.get("/api/user?mozzieId=" + mozzieId)
                .then(function (response) {
                    return response.data;
                }, function (err) {

                })
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function isAdmin() {
            return $http.post('/api/isAdmin')
                .then(function (response) {
                    return response.data;
                });
        }

        function isArtist() {
            return $http.post('/api/isArtist')
                .then(function (response) {
                    return response.data;
                });
        }

        function isLoggedin() {
            return $http.post('/api/isLoggedin')
                .then(function (response) {
                    return response.data;
                });
        }

        function getMessages() {
            return $http.get('/api/user/message')
                .then(function (response) {
                    return response.data;
                });
        }

        function addMessage(userId, message) {
            return $http.post('/api/user/' + userId + '/addMessage', message)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteMessage(userId, message) {
            return $http.post('/api/user/' + userId + '/deleteMessage', message)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllUsers() {
            return $http.get('/api/user/all')
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllArtists() {
            return $http.get('/api/artist');
        }

        function updateUser(userId, n_user) {
            return $http.put("/api/user/" + userId, n_user);
        }

        function updateProfile(user) {
            return $http.put('/api/profile/' + user._id, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function updateCurrentUser(actUser) {
            if (actUser._id) {
                currentUser.username = actUser.username;
                currentUser.firstName = actUser.firstName;
                currentUser._id = actUser._id;
                currentUser.photo = actUser.photo;
                currentUser.role = actUser.role;
                currentUser.messages = actUser.messages;
                noOfMsgs.value = currentUser.messages.filter(function (m) {
                    return !m.read;
                }).length;
            } else {
                currentUser.username = null;
                currentUser.firstName = null;
                currentUser._id = null;
                currentUser.photo = null;
                currentUser.role = null;
                currentUser.messages = null;
                noOfMsgs.value = null;
            }
        }

        function addTrack(trackId) {
            return $http.post('/api/user/addtrack/' + trackId)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteTrack(trackId) {
            return $http.post('/api/user/deletetrack/' + trackId)
                .then(function (response) {
                    return response.data;
                });
        }

        function getFavorites() {
            return $http.get('/api/user/favorite')
                .then(function (response) {
                    return response.data;
                });
        }

        function searchUsers(searchWord) {
            return $http.post('/api/user/search?key=' + searchWord)
                .then(function (response) {
                    return response.data;
                });
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function logout() {
            return $http.post('/api/logout')
                .then(function (response) {
                    return response.data;
                });
        }


    }
})();