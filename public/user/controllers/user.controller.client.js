(function () {
    angular
        .module('Mozzie')
        .controller('LoginController', LoginController)
        .controller('ProfileController', ProfileController)
        .controller('RegisterController', RegisterController)
        .controller('AdminController', AdminController);


    function LoginController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {
        var model = this;
        model.login = login;

        function init() {
        }

        init();

        function login(user) {
            if (user === null) {
                model.error = "I need a Username!";
                return;
            }
            if (user.password === null) {
                model.error = "Come on! I need a password!";
                return;
            }
            UserService
                .login(user)
                .then(function (user) {
                    if (user) {
                        if (user.role === 'ADMIN')
                            $location.url("/admin");
                        else if (user.role === 'ARTIST')
                            $location.url("/mylists");
                        else
                            $location.url("/favorite");
                    }
                    else {
                        model.error = "Hmmmm, something doesn't match";
                    }
                }, function (err) {
                    model.error = "Hmmmm, something doesn't match";
                });
        }
    }

    function ProfileController($location, $route, $sce, $window, $routeParams, currentUser, UserService, MusicService) {
        var model = this;
        model.uploadPhoto = uploadPhoto;
        model.updateProfile = updateProfile;
        model.logout = logout;
        model.getPicture = getPicture;
        model.deleteUser = deleteUser;

        function init() {
            model.user = currentUser;
            model.currentUser = currentUser;
        }

        init();

        function uploadPhoto() {
        }

        function updateProfile(user) {
            UserService
                .updateProfile(user)
                .then(function () {
                    model.message = "Updated! Looking good!"
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    UserService
                        .updateCurrentUser({});
                    $location.url('/login');
                });
        }

        function getPicture() {
            if (model.user) {
                return model.user.photo;
            } else {
                return "images/user_image.png";
            }
        }

        function deleteUser() {
            var val = UserService
                .deleteUser(userId);
            val.success(function (u) {
                $location.url("/login");
            })
                .error(function (err) {
                    model.error = "Oops! Something went wrong!";
                })
        }
    }

    function RegisterController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {
        var model = this;
        model.register = register;

        function init() {
        }

        init();

        function register(user) {
            if (user.role === 'ARTIST' && user.mozzieId === null) {
                model.error = "An artist needs an ID, MozzieId!";
                return;
            }
            if (user === null) {
                model.error = "I need a Username!";
                return;
            }
            if (user.password === null) {
                model.error = "Come on! I need a password!";
                return;
            }
            if (user.password !== user.repassword) {
                model.error = "Come on! The passwords must be same!";
                return;
            }
            if (user.firstName === null) {
                model.error = "Please enter your first name";
                return;
            }
            var val = UserService
                .findUserByUsername(user.username);
            val.success(function (user) {
                model.error = "Someone has taken this name :(";
            })
                .error(function (use) {
                    UserService
                        .register(user)
                        .then(function (use) {
                            if (use) {
                                model.message = "Ready to Rock n Roll!";
                                // if
                                if (use.data.role === 'ADMIN')
                                    $location.url("/admin");
                                else if (use.data.role === 'ARTIST')
                                    $location.url("/mylists");
                                // else if(use.data.role==="USER")
                                //     $location("/home");
                                else
                                    $location.url("/favorite");
                            } else {
                                model.error = "Oops! Something went wrong!";
                            }
                        }, function (err) {
                            model.error = "Oops! Something went wrong!";
                        });
                });
        }
    }

    function AdminController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {

        var model = this;
        model.deleteUser = deleteUser;
        model.updateUser = updateUser;

        function init() {
            UserService.currentMenu.active = "Control";
            findAllUsers();
        }

        init();

        function findAllUsers() {
            UserService
                .findAllUsers()
                .then(function (users) {
                    model.users = users;
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                });
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(findAllUsers);
        }

        function updateUser(user) {
            UserService
                .updateUser(user)
                .then(findAllUsers);
        }
    }
})();