(function () {
    angular
        .module("Mozzie")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "home/views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    actUser: checkUser
                }
            })
            .when("/login", {
                templateUrl: "user/views/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/trending", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/share/:tid", {
                templateUrl: "music/views/share.view.client.html",
                controller: "ShareController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/admin', {
                templateUrl: 'user/views/admin.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model',
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/artist", {
                templateUrl: "music/views/artist-list.view.client.html",
                controller: "ArtistListController",
                controllerAs: "model"
            })
            .when("/artist/:artistId", {
                templateUrl: "music/views/artist-track-list.view.client.html",
                controller: "ArtistTrackController",
                controllerAs: "model"
            })
            .when("/message", {
                templateUrl: "music/views/message.view.client.html",
                controller: "MessageController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/profile", {
                templateUrl: "user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/mylists", {
                templateUrl: "music/views/artist-track-list.view.client.html",
                controller: "ArtistTrackController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkArtist
                }
            })
            .when("/favorite", {
                templateUrl: "music/views/favorite.view.client.html",
                controller: "FavoriteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/register", {
                templateUrl: "user/views/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/track", {
                templateUrl: "music/views/track-list.view.client.html",
                controller: "TrackListController",
                controllerAs: "model"
            })
            .when("/track/:tid", {
                templateUrl: "music/views/track.view.client.html",
                controller: "TrackController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkUser
                }
            })
            .when("/track/new", {
                templateUrl: "music/views/track-new.view.client.html",
                controller: "TrackNewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkArtist
                }
            })
            .when("/logout", {
                resolve: {
                    logout: logout
                }
            })
            .otherwise({
                redirectTo: "/home"
            })
    }

    function checkUser($q, UserService) {
        var defer = $q.defer();
        UserService
            .isLoggedin()
            .then(function (user) {
                defer.resolve(user);
            });
        return defer.promise;
    }

    function checkLoggedIn($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .isLoggedin()
            .then(function (user) {
                if (user !== '0') {
                    defer.resolve(user);
                } else {
                    defer.reject();
                    $location.url('/login');
                }
                UserService
                    .updateCurrentUser(user);
            });
        return defer.promise;
    }

    function checkAdmin($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .isAdmin()
            .then(function (user) {
                if (user !== '0') {
                    UserService.updateCurrentUser(user);
                    defer.resolve(user);
                } else {
                    defer.reject();
                    $location.url('/user/' + user._id);
                }
            });
        return defer.promise;
    }

    function checkArtist($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .isArtist()
            .then(function (user) {
                if (user !== '0') {
                    UserService
                        .updateCurrentUser(user);
                    defer.resolve(user);
                } else {
                    defer.reject();
                    $location.url('/user/' + user._id);
                }
            });
        return defer.promise;
    }

    function logout($q, UserService, $location) {
        var defer = $q.defer();
        UserService
            .logout()
            .then(function () {
                UserService.updateCurrentUser({});
                defer.reject();
                $location.url('/login');
            });
        return defer.promise;
    }
})();