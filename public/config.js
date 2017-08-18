(function () {
    angular
        .module("Mozzie")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/views/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    actUser: checkUser
                }
            })
            .when("/login", {
                templateUrl: "views/user/views/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/admin', {
                templateUrl: 'views/user/views/admin.view.client.html',
                controller: 'AdminController',
                controllerAs: 'model',
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/register", {
                templateUrl: "views/user/views/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/profile", {
                templateUrl: "views/user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/favorite", {
                templateUrl: "views/music/views/fav.view.client.html",
                controller: "FavController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/trending", {
                templateUrl: "views/user/views/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/share/:tid", {
                templateUrl: "views/music/views/share.view.client.html",
                controller: "ShareController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
                }
            })

            .when("/artist", {
                templateUrl: "views/music/views/artist.view.client.html",
                controller: "ArtistsController",
                controllerAs: "model"
            })
            .when("/artist/:artistId", {
                templateUrl: "views/music/views/tracklist.view.client.html",
                controller: "TracksController",
                controllerAs: "model"
            })


            .when("/track", {
                templateUrl: "views/music/views/list.view.client.html",
                controller: "ListController",
                controllerAs: "model"
            })

            .when("/mylists", {
                templateUrl: "views/music/views/tracklist.view.client.html",
                controller: "TracksController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkArtist
                }
            })

            .when("/track/new", {
                templateUrl: "views/music/views/new.view.client.html",
                controller: "NewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkArtist
                }
            })
            .when("/track/:tid", {
                templateUrl: "views/music/views/track.view.client.html",
                controller: "TrackController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkUser
                }
            })
            .when("/logout", {
                resolve: {
                    logout: logout
                }
            })
            .when("/message", {
                templateUrl: "views/music/views/msg.view.client.html",
                controller: "MsgController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLoggedIn
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