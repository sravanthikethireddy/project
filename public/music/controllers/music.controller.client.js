(function () {
    angular
        .module("Mozzie")
        .controller("ArtistListController", ArtistListController)
        .controller("ArtistTrackController", ArtistTrackController)
        .controller("FavoriteController", FavoriteController)
        .controller("MessageController", MessageController)
        .controller("ShareController", ShareController)
        .controller("TrackController", TrackController)
        .controller("TrackListController", TrackListController)
        .controller("TrackNewController", TrackNewController);

    function ArtistListController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {
        var model = this;
        model.tracks = [];
        model.viewImage = viewImage;
        model.searchTracks = searchTracks;

        function init() {
            UserService.currentMenu.active = "Artists";
            UserService
                .findAllArtists()
                .then(function (artists) {
                    model.artists = artists.data;
                }, function (err) {
                    model.error = "Oops! Something went wrong!"
                })
        }

        init();

        function viewImage(track) {
            return track.image[2]['#text'] ? track.image[2]['#text'] : '../../images/music-track.png';
        }

        function searchTracks() {
            var i = 0;
            model.searchWord = MusicService.searchKey;
            model.tracks = [];
            MusicService
                .searchTracks(model.searchWord, ++i)
                .then(function (response) {
                    data = response.data;
                    data = data.results.trackmatches.track;
                    model.tracks = data;
                });
        }
    }

    function ArtistTrackController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {
        var model = this;
        model.tracks = [];
        model.viewImage = viewImage;
        model.getTracks = getTracks;

        function init() {
            model.currentUser = UserService.currentUser;
            model.artist = model.currentUser.role === "ARTIST";
            if (!model.currentUser.role === 'ARTIST')
                UserService
                    .currentMenu.active = "Artists";
            UserService
                .currentMenu.active = "MyLists";
            var artistId = $routeParams.artistId;
            if (!artistId)
                artistId = model.currentUser._id;
            getTracks(artistId);
        }

        init();


        function viewImage(track) {
            return track.image[2]['#text'] ? track.image[2]['#text'] : '../../images/music-track.png';
        }


        function getTracks(artistId) {
            model.tracks = [];
            MusicService
                .findTrackByArtist(artistId)
                .then(function (tracks) {
                    model.tracks = tracks;
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                });
        }
    }

    function FavoriteController($location, $route, $sce, $window, $routeParams,currentUser, UserService, MusicService) {
        var model = this;
        model.track = {};
        model.unFav = unFav;
        model.viewImage = viewImage;
        model.toggleWiki = toggleWiki;
        model.doYouTrustHTML = doYouTrustHTML;

        function init() {
            model.currentUser = currentUser;
            UserService
                .currentMenu.active = "Favorites";
            UserService
                .getFavorites()
                .then(function (favorites) {
                    model.favorites = favorites;
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                })
        }

        init();


        function unFav(trackId) {
            if (model.currentUser._id) {
                UserService
                    .deleteTrack(trackId)
                    .then(function (user) {
                        for (var favorit in model.favorites) {
                            if (model.favorites[favorit]._id === trackId) {
                                model.favorites.splice(favorit, 1);
                            }
                        }
                    }, function (err) {
                        model.error = "Oops! Something went wrong!";
                    });
            } else {
                model.error = "Gotta login!";
            }

        }

        function viewImage(track) {
            if (!track.name)
                return '../../images/music-track.png';
            return track.album.image[3]['#text'] ? track.album.image[3]['#text'] : '../../images/music-track.png';
        }

        function toggleWiki() {
            model.showWiki = !model.showWiki;
        }

        function doYouTrustHTML(text) {
            if (!text)
                return;
            text = text.replace("Wanna know more?", "Read more");
            text = text.replace("href", "target='_blank' href");
            return $sce.trustAsHtml(text);
        }

        function searchTracks() {
            var i = 0;
            model.searchWord = MusicService.searchKey;
            model.tracks = [];
            MusicService
                .searchTracks(model.searchWord, ++i)
                .then(function (response) {
                    data = response.data;
                    data = data.results.trackmatches.track;
                    model.tracks = data;
                });
        }
    }

    function MessageController($location, $route, $sce, $window, $routeParams, currentUser, UserService, MusicService) {
        var model = this;
        model.track = {};
        model.viewMessage = viewMessage;

        function init() {
            model.currentUser = currentUser;
            UserService
                .updateCurrentUser(currentUser);
            UserService
                .getMessages()
                .then(function (messages) {
                    model.messages = messages;
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                })
        }

        init();

        function viewMessage(message) {
            UserService
                .deleteMessage(currentUser._id, message)
                .then(function (success) {
                    $location.url('/track/' + message.track.mbid);
                }, function (err) {
                    model.error = "Oops! Something went wrong!"
                })
        }
    }

    function ShareController($location, $route, $sce, $window, $routeParams, currentUser, UserService, MusicService) {
        var model = this;
        model.track = {};
        model.shareWithUser = shareWithUser;
        model.searchUsers = searchUsers;

        function init() {
            model.currentUser = currentUser;
            UserService
                .updateCurrentUser(currentUser);
            model.trackId = $routeParams.tid;
        }

        init();

        function shareWithUser(user) {
            var message = {
                user: currentUser._id,
                track: model.trackId
            };
            UserService
                .addMessage(user._id, message)
                .then(function (success) {
                    model.users = null;
                }, function (err) {
                    model.error = "Oops! Something went wrong!"
                })
        }

        function searchUsers() {
            UserService
                .searchUsers(model.searchWord)
                .then(function (users) {
                    if (users.length === 0) {
                        model.users = null;
                        model.error = "Oops! Something went wrong!"
                    } else {
                        model.users = users;
                    }
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                });
        }
    }

    function TrackController($location, $route, $sce, $window, $routeParams, currentUser, UserService, MusicService) {
        var model = this;
        model.track = {};
        model.viewImage = viewImage;
        model.toggleWiki = toggleWiki;
        model.toggleFav = toggleFav;
        model.addComment = addComment;
        model.doYouTrustHTML = doYouTrustHTML;

        function init() {
            model.currentUser = currentUser;
            UserService
                .updateCurrentUser(currentUser);
            var trackId = $routeParams.tid;
            console.log("isir")
            model.showWiki = false;
            console.log(trackId)
            if(trackId!=="new"){
            MusicService
                .findTrackById(trackId)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    return MusicService
                        .findTrackBymbidAPI(trackId)
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
                    model.track = track;
                    if (track.title) {
                        model.track.name = track.title;
                        model.track.image = track.image;
                        model.track.url = track.url;
                        model.track.artist = {name: track.artist.mozzieId};
                    }
                    if (model.currentUser._id) {
                        if (model.currentUser.favorites.find(function (favor) {
                                return favor === track._id;
                            })) {
                            model.fav = true;
                        }
                    }
                }, function (err) {
                    model.error = "Oops! Something went wrong!";
                })
        }
        }

        init();

        function viewImage(track) {
            if (!track.name)
                return '../../images/music-track.png';
            if (track.image)
                return track.image;
            return track.album.image[2]['#text']?track.album.image[2]['#text'] : '../../images/music-track.png';
        }

        function toggleWiki() {
            model.showWiki = !model.showWiki;
        }

        function toggleFav() {
            if (model.currentUser._id) {
                if (model.fav) {
                    UserService
                        .deleteTrack(model.track._id)
                        .then(function (success) {
                            for (var faa in model.track.favs) {
                                if (model.track.favs[faa] === model.currentUser._id) {
                                    model.track.favs.splice(faa, 1);
                                }
                            }
                            model.fav = false;
                        }, function (err) {
                            model.error = "Oops! Something went wrong!";
                        });
                } else {
                    UserService
                        .addTrack(model.track._id)
                        .then(function (success) {
                            model.track.favs.push(model.currentUser._id);
                            model.fav = true;
                        }, function (err) {
                            model.error = "Oops! Something went wrong!";
                        });
                }
            } else {
                model.error = "Gotta login!";
            }

        }


        function searchTracks() {
            var i = 0;
            model.searchWord = MusicService.searchKey;
            model.tracks = [];
            MusicService
                .searchTracks(model.searchWord, ++i)
                .then(function (response) {
                    data = response.data;
                    data = data.results.trackmatches.track;
                    model.tracks = data;
                });
        }


        function addComment() {
            if (!model.comment) {
                return;
            } else if (!model.currentUser._id) {
                model.error = "Oops! Something went wrong!";
            }
            else {
                var comment = {
                    comment: model.comment,
                    user: currentUser._id,
                    createdDate: Date.now()
                };
                MusicService
                    .addComment(comment, model.track._id)
                    .then(function (success) {
                        comment.user = {
                            _id: currentUser._id,
                            firstName: currentUser.firstName
                        };
                        model.track.comments.push(comment);
                        model.comment = "";
                    }, function (err) {
                        model.error = "Oops! Something went wrong!";
                    })
            }
        }

        function doYouTrustHTML(text) {
            if (!text)
                return;
            text = text.replace("Wanna know more?", "Read more");
            text = text.replace("href", "target='_blank' href");
            return $sce.trustAsHtml(text);
        }
    }

    function TrackListController($location, $route, $sce, $window, $routeParams, UserService, MusicService) {
        var model = this;
        model.tracks = [];
        model.viewImage = viewImage;
        model.searchTracks = searchTracks;

        function init() {
            if (MusicService.searchKey)
                searchTracks();
            else
                $location.url('/home');
        }

        init();

        function viewImage(track) {
            return track.image[2]['#text'] ? track.image[2]['#text'] : '../../images/music-track.png';
        }

        function searchTracks() {
            var i = 0;
            model.searchWord = MusicService.searchKey;
            model.tracks = [];
            MusicService
                .searchTracks(model.searchWord, ++i)
                .then(function (response) {
                    data = response.data;
                    data = data.results.trackmatches.track;
                    for (var dat in data) {
                        if (data[dat].mbid !== "") {
                            model.tracks.push(data[dat]);
                        }
                    }
                    if (model.tracks.length === 0) {
                        model.error = "Oops! Something went wrong!"
                    }
                });
        }
    }

    function TrackNewController($location, $route, $sce, $window, $routeParams, currentUser, UserService, MusicService) {
        var model = this;
        model.track = {};
        model.viewImage = viewImage;
        model.toggleWiki = toggleWiki;
        model.doYouTrustHTML = doYouTrustHTML;
        model.addTrack = addTrack;
        model.toggleFav = toggleFav;

        function init() {
            model.currentUser = currentUser;
            UserService
                .updateCurrentUser(currentUser);

        }

        init();

        function viewImage(track) {
            if (!track.name)
                return '../../images/music-track.png';
            return track.album.image[2]['#text'] ? track.album.image[2]['#text'] : '../../images/music-track.png';
        }

        function toggleWiki() {
            model.showWiki = !model.showWiki;
        }

        function doYouTrustHTML(text) {
            if (!text)
                return;
            text = text.replace("Wanna know more?", "Read more");
            text = text.replace("href", "target='_blank' href");
            return $sce.trustAsHtml(text);
        }

        function addTrack() {
            if (!model.track.title) {
                model.error = "Oops! Something went wrong!";
                return;
            } else if (!model.track.url) {
                model.error = "Oops! Something went wrong!";
            }
            else {
                track.artist = model.currentUser.mozzieId;
                MusicService
                    .addTrack(model.track)
                    .then(function (success) {

                    }, function (err) {
                        model.error = "Oops! Something went wrong!";
                    })
            }
        }

        function toggleFav() {
            if (model.currentUser._id) {
                if (model.fav) {
                    UserService
                        .deleteTrack(model.track._id)
                        .then(function (success) {
                            for (var faa in model.track.favs) {
                                if (model.track.favs[faa] === model.currentUser._id) {
                                    model.track.favs.splice(faa, 1);
                                    model.track.save();
                                }
                            }
                            model.fav = false;
                        }, function (err) {
                            model.error = "Oops! Something went wrong!";
                        });
                } else {
                    UserService
                        .addTrack(model.track._id)
                        .then(function (success) {
                            model.track.favs.push(model.currentUser._id);
                            model.fav = true;
                        }, function (err) {
                            model.error = "Oops! Something went wrong!";
                        });
                }
            } else {
                model.error = "Gotta login!";
            }

        }


        function searchTracks() {
            var i = 0;
            model.searchWord = MusicService.searchKey;
            model.tracks = [];
            MusicService
                .searchTracks(model.searchWord, ++i)
                .then(function (response) {
                    data = response.data;
                    data = data.results.trackmatches.track;
                    model.tracks = data;
                });
        }
    }
})();
