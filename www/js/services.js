var app = angular.module('starter.services', []);
var pS;
var dP;
var progressStatus = {};
var downloadStatus = {};
var dStatus = [];
var currentTrack;


app.factory('DownloadStatus', function (player)
{
    return {
        isDownloading: function ()
        {
            if (progressStatus[currentTrack] != 0 || progressStatus[currentTrack] != null)
            {
                return progressStatus[currentTrack];
                //alert(progressStatus[currentTrack]);
            } else
            {
                return 0;
            }
        },
        isDownloading2: function ()
        {
            if (downloadStatus[currentTrack] != null && downloadStatus[currentTrack] != 0)
            {

            }
            return downloadStatus[currentTrack];
        }
    }

})


app.factory('dataBank', function ($http, DownloadStatus, $cordovaFileTransfer, $cordovaToast, player, $location, loader, $cordovaLocalNotification, $ionicPlatform)
{
    var dataBank = {};
    var playlists = [];
	var artists = [];
	var albums = [];
	var year = [];
	var rating = [];

    dataBank.notif = function ()
    {
        $cordovaLocalNotification.add({
            id: player.songArtist,
            //	date: alarmTime,
            message: player.songAlbum,
            title: player.songArtist,
            //autoCancel: true,
            sound: null
        }).then(function () {
            //alert("The notification has been set"+player.albumArt);
        });
        //return dataBank;
    }

    dataBank.downloadSong = function ()
    {
        //var downloadingTrack=player.songTitle;
        //var obj = new Object();
        var url = player.songURL;
        var filename = url.split("/").pop();
        filename = url.split("&").pop();
        filename = url.split("=").pop();
        filename = decodeURIComponent(filename);
        var downloadingTrack = filename;
        //var targetPath = cordova.file.dataDirectory + "test.mp3";
        //var targetPath = 'file:///android_asset/www/audio/' + "test.mp3";
        //var targetPath =  filename;
        var targetPath = cordova.file.externalCacheDirectory + filename;
        //alert("dataBank.downloadSong TragerPath: "+targetPath);
        var trustHosts = true;
        var options = {};
        //alert("Called");
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function (result) {
                    $cordovaToast
                            .show('File downloaded successfully..', 'short', 'center')
                            .then(function () {
                                //pS=0;
                                //pS=0;
                                progressStatus[downloadingTrack] = 0;
                                //progressStatus.splice(player.songTitle,1);
                                //downloadStatus.splice(player.songTitle,1);
                                downloadStatus[downloadingTrack] = 0;
                                // success
                            }, function () {
                                // error
                                alert("Donwload Failed");
                            });

                    //console.log(result);
                }, function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'No internet access',
                        buttons: [{
                                text: 'OK',
                                type: 'button-assertive'
                            }]
                    });
                    alertPopup.then(function () {});

                }, function (progress) {
                    //alert("Progress");
                    //	pS=1;


                    progressStatus[downloadingTrack] = 1;
                    var dnldpgs = progress.loaded.toString().substring(0, 2);
                    var d = ((progress.loaded / progress.total) * 100).toString().substring(0, 2);
                    downloadProgress = parseInt(d);
                    //alert(downloadProgress);
                    downloadStatus[downloadingTrack] = downloadProgress;
                    //alert(downloadStatus[player.songTitle]);
                    dP = downloadProgress;
                    //alert(dp);
                    pS = 1;
                });
    }

    dataBank.downloadSongP = function (url, title)
    {
        var url = url;
        var filename = url.split("/").pop();
        filename = url.split("&").pop();
        filename = url.split("=").pop();
        filename = decodeURIComponent(filename);
        var downloadingTrack = filename;
        var targetPath = cordova.file.externalCacheDirectory + filename;
        //alert(targetPath);
        var trustHosts = true;
        var options = {};
        //alert("Called");
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function (result)
                {
                    $cordovaToast
                            .show('File downloaded successfully..', 'short', 'center')
                            .then(function ()
                            {
                                progressStatus[downloadingTrack] = 0;
                                downloadStatus[downloadingTrack] = 0;
                                // success
                            }, function ()
                            {
                                // error
                                alert("Donwload Failed");
                            });

                    //console.log(result);
                }, function ()
                {
                    var alertPopup = $ionicPopup.alert(
                            {
                                title: 'No internet access',
                                buttons: [
                                    {
                                        text: 'OK',
                                        type: 'button-assertive'
                                    }]
                            });
                    alertPopup.then(function () {});

                }, function (progress)
                {
                    progressStatus[downloadingTrack] = 1;
                    var dnldpgs = progress.loaded.toString().substring(0, 2);
                    var d = ((progress.loaded / progress.total) * 100).toString().substring(0, 2);
                    downloadProgress = parseInt(d);
                    //alert(downloadProgress);
                    downloadStatus[downloadingTrack] = downloadProgress;
                    //alert(downloadStatus[player.songTitle]);
                    dP = downloadProgress;
                    //alert(dp);
                    pS = 1;
                });
    }
    return dataBank;
});

/**
 * dataSource
 * @param  {[type]} $http     [description]
 * @param  {[type]} $location [description]
 * @return {[type]}           [description]
 */
app.factory('dataSource', function ($http, $location, loader)
{

    var time = Math.floor(new Date().getTime() / 1000);

    var key = function (password) {
        return sha256(password);
    };

    var passphrase = function (password) {
        return sha256(time + key(password));
    };

    //var server_url = 'http://128.199.210.190/server/xml.server.php';
    //var server_url = 'http://128.199.210.190';
    // var server_url = 'http://www.ampache.io/server/xml.server.php';
   // var server_url = 'http://ultimateseolab.com/ampache/server/xml.server.php';
    var server_url='http://128.199.210.190/music/server/xml.server.php';
  //var server_url='http://128.199.210.190/demo/server/xml.server.php';
  

    return {
        getAuth: function (username, password) {
            loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'handshake',
                    auth: passphrase(password),
                    timestamp: time,
                    version: '370001',
                    user: username
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
					// console.log("Authorize: "+JSON.stringify(json));
                    return json;
                }
            };

            var promise = $http(config);

            return promise;


        },
        getPlaylist: function (auth, filter) {
            loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'playlist',
                    auth: auth,
                    filter: filter,
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    //console.log("getPlaylist: "+JSON.stringify(json));
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },

        getPlaylists: function (auth, filter, exact) {
            loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'playlists',
                    auth: auth,
                    filter: filter,
                    exact: exact
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                     //console.log(JSON.stringify(json)+ " ");
                    // console.log("getPlaylists: "+JSON.stringify(json));
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
		getAlbums: function (auth, filter, exact) {
            loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'albums',
                    auth: auth,
                    filter: filter,
                    exact: exact
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                     //console.log(JSON.stringify(json)+ " ");
                    // console.log("getPlaylists: "+JSON.stringify(json));
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },

        getPlaylistSongs: function (auth, filter) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'playlist_songs',
                    auth: auth,
                    filter: filter
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                   // console.log("getPlaylistSongs "+JSON.stringify(json)+ " ");
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
		
		getArtistSongs: function (auth, filter) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'artist_songs',
                    auth: auth,
                    filter: filter
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                   // console.log("getPlaylistSongs "+JSON.stringify(json)+ " ");
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
		
		getAlbumSongs: function (auth, filter) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'album_songs',
                    auth: auth,
                    filter: filter
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                   // console.log("getPlaylistSongs "+JSON.stringify(json)+ " ");
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },

        getSongs: function (auth, callback) {
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'songs',
                    auth: auth,
                    offset: 1,
                    limit: 10
                },
                transformResponse: function (data) {
                    // convert the data to JSON and provide
                    // it to the success function below      
                    //console.log(data);
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);

                    return json;
                }
            };

            var promise = $http(config).success(function (data, success) {
                // send the converted data back
                // to the callback function
                callback(data);
            });
        },

        getTags: function (auth, filter, exact) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'tags',
                    auth: auth,
                    filter: filter,
                    exact: exact
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },

        getTag: function (auth, filter) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'tag',
                    auth: auth,
                    filter: filter
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
		
		getArtists: function (auth, filter,exact) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'artists',
                    auth: auth,
                    filter: filter,
					exact: exact
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
		getArtistSongs: function (auth, filter) {
            //loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'artist_songs',
                    auth: auth,
                    filter: filter
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                   // console.log("getPlaylistSongs "+JSON.stringify(json)+ " ");
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
		
        getTagSongs: function (auth, filter) {
            loader.show();
            var config = {
                method: 'get',
                url: server_url,
                params: {
                    action: 'tag_songs',
                    auth: auth,
                    filter: filter
                },
                transformResponse: function (data) {
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    return json;
                }
            };

            var promise = $http(config);

            return promise;
        },
    };

});


/**
 * dataFormatter
 * @return {[type]} [description]
 */
app.factory('dataFormatter', function () {
    return {
        auth: function (data) {
            //console.log(data);
            return data.root.auth.__cdata;
        },
        songs: function (data) {
            var raw = data.root.song;
            // console.log("DATA FORMATTER: "+JSON.stringify(data.root.song.artist.__cdata));
            var tracks = [];

            if (raw.length) { //more than one song
                for (var x = 0; x < raw.length; x++) {
                    temp = {};
                    temp['title'] = raw[x].title.__cdata;
                    temp['artist'] = raw[x].artist.__cdata;
                    temp['album'] = raw[x].album.__cdata;
                    temp['url'] = raw[x].url.__cdata;
                    temp['art'] = raw[x].art.__cdata;
                    temp['duration'] = raw[x].time;
                    tracks.push(temp);
                    temp = {};
                }
            } else {
                temp = {};
                temp['title'] = raw.title.__cdata;
                temp['artist'] = raw.artist.__cdata;
                temp['album'] = raw.album.__cdata;
                temp['url'] = raw.url.__cdata;
                temp['art'] = raw.art.__cdata;
                temp['duration'] = raw.time;
                tracks.push(temp);
                temp = {};
            }

            return tracks;
        },
        playlists: function (data) {

            var raw = data.root.playlist;
            var playlists = [];
            if (!raw) { //if playlist is return or an error
                var error = {
                    'code': data.root.error._code,
                    'message': data.root.error.__cdata,
                };

                return error;
            } else {
                temp = {};
                //	console.log(raw.length);
                if (raw.length) { //if more than one playlist
                    for (var x = 0; x < raw.length; x++) {
                        temp['id'] = raw[x]._id;
                        temp['name'] = raw[x].name.__cdata;
                        temp['owner'] = raw[x].owner.__cdata;
                        temp['type'] = raw[x].type;
                        temp['items'] = raw[x].items;
                        //console.log(JSON.stringify(temp)+ " X: "+x);
                        playlists.push(temp);
                        temp = {};
                        //console.log("AFTER PUSH :"+JSON.stringify(temp));
                    }
                } else {
                    temp['name'] = raw.name.__cdata;
                    temp['owner'] = raw.owner.__cdata;
                    temp['id'] = raw._id;
                    temp['type'] = raw.type;
                    temp['items'] = raw.items;
                    playlists.push(temp);
                }
                // console.log("BEFORE RETURN: "+JSON.stringify(playlists)           );
                return playlists;
            }


        },
        tags: function (data) {

            var raw = data.root.tag;

            var tag = {};

            tag['id'] = raw._id;
            tag['name'] = raw.name.__cdata;
            tag['albums'] = raw.albums;
            tag['artists'] = raw.artists;
            tag['songs'] = raw.songs;

            return tag;
        },
		artists: function (data) {

            var raw = data.root.artist;
            var artists = [];
            if (!raw) { //if playlist is return or an error
                var error = {
                    'code': data.root.error._code,
                    'message': data.root.error.__cdata,
                };

                return error;
            } else {
                temp = {};
                //	console.log(raw.length);
                if (raw.length) { //if more than one playlist
                    for (var x = 0; x < raw.length; x++) {
                        temp['id'] = raw[x]._id;
                        temp['name'] = raw[x].name.__cdata;
                        //console.log(JSON.stringify(temp)+ " X: "+x);
                        artists.push(temp);
                        temp = {};
                        //console.log("AFTER PUSH :"+JSON.stringify(temp));
                    }
                } else {
					temp['id'] = raw[x]._id;
                    temp['name'] = raw.name.__cdata;
                    artists.push(temp);
                }
                // console.log("BEFORE RETURN: "+JSON.stringify(playlists)           );
                return artists;
            }
        },
        albums: function (data) {
			var raw = data.root.album;
            var albums = [];
            if (!raw) { //if playlist is return or an error
                var error = {
                    'code': data.root.error._code,
                    'message': data.root.error.__cdata,
                };

                return error;
            } else {
                temp = {};
                //	console.log(raw.length);
                if (raw.length) { //if more than one playlist
                    for (var x = 0; x < raw.length; x++) {
                        temp['id'] = raw[x]._id;
                        temp['name'] = raw[x].name.__cdata;
                        //console.log(JSON.stringify(temp)+ " X: "+x);
                        albums.push(temp);
                        temp = {};
                        //console.log("AFTER PUSH :"+JSON.stringify(temp));
                    }
                } else {
					temp['id'] = raw[x]._id;
                    temp['name'] = raw.name.__cdata;
                    albums.push(temp);
                }
                // console.log("BEFORE RETURN: "+JSON.stringify(playlists)           );
                return albums;
            }
        }
    };
});

/**
 * player
 * @param  {[object]} audio      [description]
 * @param  {[object]} $rootScope [description]
 * @return {[object]}            [description]
 */
app.factory('player', function (audio, $rootScope, $location, $cordovaLocalNotification, $cordovaFileTransfer, $ionicPlatform)
{
    var player,
            queue = [], //array of functions    
            paused = false,
            art = "img/ionic.png",
            artist = "No artist",
            title = "No song loaded",
            album = "No album",
            duration = '00',
            url = "",
            footStts = true,
            sec = '00',
            min = '00',
            current = {
                track: 0,
            };

    player = {

        playlist: [],

        queue: queue,

        current: current,

        playing: false,

        repeatState: false,

        shuffleState: false,

        repeatCheck: false,

        songArtist: artist,

        albumArt: art,

        songAlbum: album,

        songTitle: title,

        duration: duration,

        songURL: url,

        footStts: footStts,

        sec: sec,

        min: min,

        play: function (track)
        {
            // alert("Play service Track"+track);

            if (player.songTitle.localeCompare("No song loaded") == 0)
            {
                $location.url("tab/player");
                //footerStatus = true;
            } else
            {
                //$scope.isMainPanel=false;
            }

            if (!player.playlist.length)
                return;
            player.setter(track);
            audio.play();
            paused = false;
            player.playing = true;
            player.footStts = true;
            $cordovaLocalNotification.add(
                    {
                        id: player.songArtist,
                        //	date: alarmTime,
                        message: player.songAlbum,
                        title: player.songArtist,
                        //autoCancel: true,
                        sound: null
                    })
                    .then(function ()
                    {
                        //alert("The notification has been set"+player.albumArt);
                    });

        },

        pause: function ()
        {
           // console.log("PAUSE: " + player.footStts);
            if (player.playing)
            {

                player.footStts = false;
               // console.log("" + player.footStts);
                audio.pause();
                player.playing = false;
                paused = true;
            }
        },

        reset: function ()
        {
            player.pause();
            current.track = 0;
            player.playlist = [];
            player.albumArt = art;
            player.songArtist = artist;
            player.songAlbum = album;
            player.songTitle = title;
            player.duration = duration;
            player.songURL = url;
            player.sec = sec;
            player.min = min;
        },

        setter: function (track)
        {

            playlistLen = player.playlist.length;
           // console.log("SETTER: " + player.playlist.length);
            temp = [];
            for (i = 0; i < playlistLen; i++)
            {
                temp[i] = i;
            }

            tempTrack = window.knuthShuffle(temp.slice(0));
            //console.log(tempTrack);

            if (angular.isDefined(track))
            {
                current.track = track;
                audio.src = player.playlist[current.track].url;
                player.songURL = player.playlist[current.track].url;
            } else
            {
                if (!paused)
                {

                    audio.src = player.playlist[current.track].url;
                    player.songURL = player.playlist[current.track].url;


                    /*var url = player.playlist[current.track].url;
                     var filename = url.split("/").pop();
                     filename = url.split("&").pop();
                     filename= url.split("=").pop();
                     var targetPath = cordova.file.dataDirectory + filename;
                     player.songURL =targetPath;*/
                }
            }

            player.albumArt = player.playlist[current.track].art;
            player.songTitle = player.playlist[current.track].title;
            player.songArtist = player.playlist[current.track].artist;
            player.songAlbum = player.playlist[current.track].album;
            player.duration = player.playlist[current.track].duration;



            player.songURL = player.playlist[current.track].url;
            var s = parseInt(player.duration % 60, 10);
            var m = parseInt((player.duration / 60) % 60, 10);
            player.sec = ('0' + s).slice(-2);
            player.min = ('0' + m).slice(-2);
        },

        repeat: function ()
        {
            player.repeatState = !player.repeatState ? true : false;
        },

        shuffle: function ()
        {
            player.shuffleState = (!player.shuffleState) ? true : false;
        },

        next: function ()
        {

            if (!player.playlist.length)
                return; //player.playlist empty
            paused = false;
            if (player.playlist.length > (current.track + 1))
            {
                current.track++;
            } else
            {
                player.repeatCheck = true;
                current.track = 0;
            }

            if (player.repeatCheck)
            {
                player.repeatCheck = false;
                if (!player.repeatState)
                {
                    player.setter();
                    player.pause();
                }
            }

            if (player.playing)
            {
                player.play();
                dataBank.notif();

            }
        },

        download: function ()
        {
            dataBank.downloadSong();
        },

        previous: function ()
        {

            if (!player.playlist.length)
                return;
            paused = false;
            if (current.track > 0)
            {
                current.track--;
            } else
            {
                current.track = player.playlist.length - 1;
            }
            if (player.playing)
            {
                player.play();
            }
        }
    };

    /**
     * add tracks to queue
     * @param {[object]} songs [object of songs from a player.playlist/album/tag cloud]
     * @param {[string]} title [title of song selected, used to determine song track to play, could be undefined]
     */
    queue.add = function (songs, title)
    {
        //console.log("SONGS: "+JSON.stringify(songs));
        alert(title);
        selected = 0;

        len = songs.length;

        player.reset();

        for (var i = 0; i < len; i++)
        {
            //check if song exist, there's an issue when view is changed... songs get added twice when same list is added, better compare with the current queue
            if (player.playlist.indexOf(songs[i]) != -1)
                return;
            player.playlist.push(songs[i]);

            //play selected track
            if (title !== undefined && songs[i].title === title) {
                selected = i;
            }

        }

        player.play(selected);
        // player.albumArt = player.playlist[current.track].art;
        // player.songTitle = player.playlist[current.track].title;
        // player.duration = player.playlist[current.track].duration;
    };

    queue.remove = function (index)
    {
        player.playlist.splice(index, 1);
    };

    //Check if audio has ended, if it is, continue to next
    audio.addEventListener('ended', function () {
        $rootScope.$apply(player.next);
    }, false);

    return player;
});

// extract the audio for making the player easier to test




app.factory('DownloadService', function ($scope, $ionicPlatform, $cordovaFile, $interval, $rootScope) {
    var directory = 'downloads';
    var filename = 'download.mp3';
    var downloading = [];

    $ionicPlatform.ready(function () {})
            .then(function () {
                return $cordovaFile.createDir(directory, false);
            })
            .then(function () {
                return $cordovaFile.createFile(directory + '/' + filename, false);
            })
            .then(function (newFile) {
                downloading.push(podcast);
                return $cordovaFile.downloadFile(url, newFile.nativeURL);
            })
            .then(function (result) {
                // Success!
            }, function (err) {
                // Error
            }, function (progress) {
                // constant progress updates
                downloading.forEach(function (download) {
                    if (download.num == podcast.num) {
                        download.progress = progress.loaded / progress.total;
                    }
                });
            });
});


app.factory('audio', function ($document) {
    var audio = $document[0].createElement('audio');
    return audio;
});

app.factory('session', function (player, dataSource) {
    var session;

    session = {
        login: function (username, password) {
            session.request = dataSource.getAuth(username, password);
        },
        logout: function () {

            //reset player
            player.reset();

            //destroy session
            localStorage.removeItem("auth");
        }
    };

    return session;
});



app.factory('Playlists', function (dataSource) {
    return {
        request: function (auth, filter, exact) {
            return dataSource.getPlaylists(auth, filter, exact);
        }
    };
    /*return {
     all: function() {
     return "me";
     },
     get: function(playlistId) {
     // Simple index lookup
     return playlists[playlistId];
     }
     };*/
});

app.factory('Tags', function (dataSource) {
    return {
        request: function (auth, filter, exact) {
            return dataSource.getTags(auth, filter, exact);
        }
    };
});

app.factory('Tag', function (dataSource) {
    return {
        request: function (auth, filter) {
            return dataSource.getTag(auth, filter);
        }
    };
});

app.factory('TagSongs', function (dataSource) {
    return {
        request: function (auth, filter) {
            return dataSource.getTagSongs(auth, filter);
        }
    };
});

app.factory('loader', function ($rootScope, $ionicLoading) {
    return {
        show: function () {
            $rootScope.loading = $ionicLoading.show({
                templateUrl: "templates/loader.html"
            });
        },
        hide: function () {
            $ionicLoading.hide();
        }
    };
});

app.factory('PlaylistSongs', function (dataSource) {
    return {
        request: function (auth, filter) {
            return dataSource.getPlaylistSongs(auth, filter);
        }
    };
});

app.factory('popup', function ($ionicPopup) {

    return {
        showAlert: function (title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });

            alertPopup.then(function (res) {
                //popup close, do nothing
            });
        }

    };

});

app.factory('myHttpInterceptor', function ($q, $rootScope) {
    return {
        request: function (config) {
            //$rootScope.$broadcast('loading-started');
            return config || $q.when(config);
        },
        response: function (response) {
            //$rootScope.$broadcast('loading-complete');
            return response || $q.when(response);
        }
    };
});

app.factory('MediaService', function ($cordovaMedia) {

    var source = null;

    function getSource() {
        if (ionic.Platform.isAndroid()) {
            //source = '/android_asset/www/' + source;
            source = source;
            return source;
        } else {
            return source;
        }
    }

    function setSource(src) {
        source = src;
    }

    function success() {
        this.release();
    }

    function error(e) {
        alert("error playing sound: " + JSON.stringify(e));
    }

    return {
        PlayMedia: function (src) {
            setSource(src);
            var srcToPlay = getSource();
            if (ionic.Platform.isAndroid()) {
                var mediaRes = new Media(srcToPlay, success, error);
                mediaRes.play();
                return mediaRes;
            } else {
               // console.log("unable to play sound!");
            }
        },

        StopMedia: function ()
        {
            media.stop();
        }
    }

});

app.factory("$fileFactory", function ($q) {

    var File = function () { };

    File.prototype = {

        getParentDirectory: function (path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function (fileSystem) {
                fileSystem.getParent(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntriesAtRoot: function () {
            var deferred = $q.defer();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function (entries) {
                    deferred.resolve(entries);
                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntries: function (path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function (fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function (entries) {
                    deferred.resolve(entries);
                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

    return File;

});

app.factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork) {

    return {
        isOnline: function () 
        {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function () 
        {
            if (ionic.Platform.isWebView()) 
            {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        },
        isWifi: function ()
        {
            if (navigator.connection.type == Connection.WIFI)
            {
                return true;
            }
            else
            {
                return false;
            }

        },
        startWatching: function () 
        {
            if (ionic.Platform.isWebView()) {

                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log("went online");
                });

                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log("went offline");
                });

            } else {

                window.addEventListener("online", function (e) {
                    console.log("went online");
                }, false);

                window.addEventListener("offline", function (e) {
                    console.log("went offline");
                }, false);
            }
        }
    }
});