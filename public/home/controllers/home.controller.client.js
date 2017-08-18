(function () {
    angular
        .module("Mozzie")
        .controller("HeaderController", HeaderController)
        .controller("HomeController", HomeController);

    function HeaderController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {
        var model = this;
        model.currentUser = UserService.currentUser;
        model.currentMenu = UserService.currentMenu;
        model.noOfMsgs = UserService.noOfMsgs;
        model.updateUser = updateUser;
        model.backFunction = backFunction;
        model.searchTracks = searchTracks;
        model.guestList = [
            {
                title: "Home",
                url: "#/home",
                current: model.currentMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: model.currentMenu.active === "Artists"
            }];
        model.userList = [
            {
                title: "Home",
                url: "#/home",
                current: model.currentMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: model.currentMenu.active === "Artists"
            },
            {
                title: "Favorites",
                url: "#/favorite",
                current: model.currentMenu.active === "Favorites"
            }
        ];
        model.artistList = [
            {
                title: "Home",
                url: "#/home",
                current: model.currentMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: model.currentMenu.active === "Artists"
            },
            {
                title: "Favorites",
                url: "#/favorite",
                current: model.currentMenu.active === "Favorites"
            },
            {
                title: "MyLists",
                url: "#/mylists",
                current: model.currentMenu.active === "MyLists"
            }
        ];

        model.adminList = [
            {
                title: "Home",
                url: "#/home",
                current: model.currentMenu.active === "Home"
            },
            {
                title: "Artists",
                url: "#/artist",
                current: model.currentMenu.active === "Artists"
            },
            {
                title: "Favorites",
                url: "#/favorite",
                current: model.currentMenu.active === "Favorites"
            },
            {
                title: "Control",
                url: "#/admin",
                current: model.currentMenu.active === "Control"
            }
        ];
        model.menu = model.currentUser._id ? model.userList : model.guestList;

        function init() {

        }

        init();


        function updateUser() {
        }
        function backFunction() {
            var link = $location.path();
            switch (link) {
                case '/login':
                    $location.url('/home');
                    break;
                case '/artist':
                    $location.url('/home');
                    break;
                case '/admin':
                    $location.url('/home');
                    break;
                case '/favorite':
                    $location.url('/home');
                    break;
                case '/mylists':
                    $location.url('/home');
                    break;
                case '/track':
                    $location.url('/home');
                    break;
                case '/track/':
                    $location.url('/track');
                    break;
                case '/register':
                    $location.url('/login');
                    break;
                case '/messages':
                    $location.url('/home');
                    break;
                case '/artist/':
                    $location.url('/artist');
                    break;
                default:
                    $location.url('/home');
                    break;
            }
        }
        function searchTracks() {
            MusicService
                .searchKey = model.searchWord;
            if ($location.path() === '/track') {
                $route.reload();
            } else
                $location.url('/track');
        }

    }

    function HomeController($location, $route, $sce, $window, $routeParams, actUser, UserService, MusicService) {
        var model = this;
        model.searchWord = "";
        model.topTracks = topTracks;
        model.viewImage = viewImage;
        model.displayArtist = displayArtist;

        function init() {
            UserService
                .updateCurrentUser(actUser);
            UserService
                .currentMenu.active = "Home";

            if (MusicService
                    .searchKey)
                MusicService
                    .searchKey = null;
            topTracks();
        }
        init();

        function topTracks() {
            model.tracks = [];
            model.test = "Top Tracks";
            MusicService
                .topTracks()
                .then(function (response) {
                    data = response.data;
                    data = data.tracks.track;
                    model.tracks = data;
                });
        }

        function viewImage(track) {
            return track.image[2]['#text'] ? track.image[2]['#text'] : '../../images/music-track.png';
        }

        function displayArtist(track) {
            MusicService
                .findTrackById(track.mbid)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    return MusicService
                        .findTrackBymbidAPI(track.mbid)
                        .then(function (response) {
                            data = response.data;
                            model.track = data.track;
                            return MusicService
                                .getTrackDetails(model.track)
                        }, function (err) {
                            model.error = "Oops! Something went wrong!";
                        })
                })
                .then(function (track) {
                    model.track._id = track._id;
                    $location.url('/artist/'+track.artist);
                }, function (err) {
                    model.error = "Oops! Something went wrong!.";
                })
        }
    }
})();
