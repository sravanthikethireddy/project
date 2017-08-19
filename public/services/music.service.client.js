(function () {
    angular
        .module("Mozzie")
        .factory("MusicService", MusicService);

    function MusicService($http) {

        var key = "30a06320e1f7730fcc166e7d758722e0";
        var secret = "1baca427e4875f2769f9baf6966b9aed";
        var urlBase = "http://ws.audioscrobbler.com/2.0/?method=METHOD&PARAMS&api_key=API_KEY&format=json";
        var searchKey = null;
        var api = {
            "topTracks": topTracks,
            "getGenre": getGenre,
            "findTrackByArtist": findTrackByArtist,
            "findTrackBymbidAPI": findTrackBymbidAPI,
            "findTrackById": findTrackById,
            "searchTracks": searchTracks,
            "searchKey": searchKey,
            "getTrackDetails": getTrackDetails,
            "findTrackBymbid": findTrackBymbid,
            "addComment": addComment
        };
        return api;

        function topTracks() {
            console.log("test")
            var urlBase = "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=disco&api_key=API_KEY&format=json";
            var url = urlBase.replace("API_KEY", key);
            return $http.get(url);
        }

        function getGenre() {
            console.log("test")
            var url = urlBase.replace("API_KEY", key);
        }

        console.log("test");

        function findTrackByArtist(artistId) {
            return $http.get('/api/artistTrack/' + artistId)
                .then(function (response) {
                    return response.data;
                });
        }

        console.log("test")

        function findTrackBymbidAPI(trackId) {
            var method = "track.getInfo";
            var params = "mbid=" + trackId;
            var url = urlBase
                .replace("API_KEY", key)
                .replace("PARAMS", params)
                .replace("METHOD", method)
            ;
            return $http.get(url);
        }

        console.log("test")

        function findTrackById(trackId) {
            console.log("oook")
            console.log(trackId)
            return $http.get('/api/track/' + trackId);
        }

        function searchTracks(searchWord, page) {
            var method = "track.search";
            console.log("test")
            var params = "track=" + searchWord + "&page=" + page;
            var url = urlBase
                .replace("API_KEY", key)
                .replace("METHOD", method)
                .replace("PARAMS", params);
            return $http.get(url);
        }

        console.log("test")

        function getTrackDetails(track) {
            console.log(track)
            var tags = [];
            for (var ta in track.toptags.tag) {
                console.log(track.toptags);
                tags.push(track.toptags.tag[ta].name);
            }
            console.log(track)

            var wiki;
            if (track.wiki) {
                wiki = {
                    summary: track.wiki.summary,
                    published: track.wiki.published
                }
            }
            track = {
                title: track.name,
                image: track.album.image[2]['#text'],
                mbid: track.mbid,
                playCount: track.playcount,
                url: track.url,
                artist: track.artist.name,
                tags: tags,
                listenersCount: track.listeners,
                wiki: wiki
            };
            return $http.post('/api/track', track)
                .then(function (response) {
                    return response.data;
                });
        }

        function findTrackBymbid(mbid) {
            return $http.get('/api/track/mbid=' + mbid)
                .then(function (response) {
                    return response.data;
                });
        }

        function addComment(comment, trackId) {
            return $http.post('/api/track/' + trackId + '/addComment', comment)
                .then(function (response) {
                    return response.data;
                });
        }

    }
})();

