(function () {
    angular
        .module("Mozzie")
        .factory("UserService", userService);

    function userService($http) {
        var currentUser = {messages: []};
        var noOfMsgs = {};
        var currentMenu = {};

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
            "currentMenu": currentMenu,
            "addTrack": addTrack,
            "deleteTrack": deleteTrack,
            "getFavorites": getFavorites,
            "searchUsers": searchUsers,
            "register": register,
            "logout": logout
        };
        return api;

        function login(user) {
            var url = '/api/login';
            return $http.post(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=";
            return $http.get(url + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function findUserByMozzieId(mozzieId) {
            var url = "/api/user?mozzieId=";
            return $http.get(+mozzieId)
                .then(function (response) {
                    return response.data;
                }, function (err) {

                })
        }

        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }

        function isAdmin() {
            var url = '/api/isAdmin';
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function isArtist() {
            var url = '/api/isArtist';
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function isLoggedin() {
            var url = '/api/isLoggedin';
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function getMessages() {
            var url = '/api/user/message';
            return $http.get(url)
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
            var url = '/api/user/all';
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllArtists() {
            var url = '/api/artist';
            return $http.get(url);
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
            return $http.remove("/api/user/" + userId);
        }

        function updateCurrentUser(actUser) {
            if (actUser._id) {
                currentUser.photo = actUser.photo;
                currentUser._id = actUser._id;
                currentUser.username = actUser.username;
                currentUser.messages = actUser.messages;
                currentUser.firstName = actUser.firstName;
                currentUser.role = actUser.role;
                noOfMsgs.value = currentUser.messages.filter(function (msg) {
                    return !msg.read;
                }).length;
            } else {
                currentUser.photo = null;
                currentUser._id = null;
                currentUser.username = null;
                currentUser.firstName = null;
                currentUser.messages = null;
                currentUser.role = null;
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
            var url = '/api/user/favorite';
            return $http.get(url)
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
            var url = "/api/register";
            return $http.post(url, user);
        }

        function logout() {
            var url = '/api/logout';
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();