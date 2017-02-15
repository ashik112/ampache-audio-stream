var app = angular.module('starter.controllers', ["ngCordova"]);

app.controller('DownloadedCtrl', function ($scope, player, $ionicPlatform, $rootScope, audio, MediaService, $fileFactory, $window) //$cordovaFileTransfer,
{
    /*Get Songs from the Device Directory*/
    var fs = new $fileFactory();
    $ionicPlatform.ready(function () {
        fs.getEntries(cordova.file.externalCacheDirectory).then(function (result) {
            $scope.files = result;
        });
    });

    /*Get filename from the song URL and determine the download and progress status (to check if it is downloading or not and check the percentage*/
    try
    {
        var url = player.songURL;
        var filename = url.split("/").pop();
        filename = url.split("&").pop();
        filename = url.split("=").pop();
        var targetPath = cordova.file.externalCacheDirectory + filename;
        $scope.downloadStatuss2 = downloadStatus;
        $scope.downloadStatuss3 = progressStatus;
    }
    catch(error)
    {
        
    }


    /*Play Downloaded Songs*/
    $scope.isSoundLoaded = false;
    $scope.audio = null;
    $scope.media = null;

    $scope.playMedia = function (key)
    {
        key = key.replace('%20', ' ');
        var src = cordova.file.externalCacheDirectory + key;
        $window.resolveLocalFileSystemURL(src, function (dir)
        {
            if ($scope.isSoundLoaded)
            {
                $scope.media.stop();
            }
            var basePath = dir.toInternalURL();
            $scope.media = MediaService.PlayMedia(basePath);
            $scope.isSoundLoaded = true;
        });
    }
    /*Stop Songs from playing*/
    $scope.stopMedia = function ()
    {
        $scope.media.stop();
    }

    /*Play downloaded songs*/
    $scope.playing = false;
    $scope.play = function (fileName)
    {
        if ($scope.playing == true)
        {
            $scope.media.stop();
            //  $scope.stopMedia();
            $scope.playing = false;
            //$scope.isSoundLoaded=false;

        } else
        {
            $scope.playMedia(fileName);
            $scope.playing = true;
        }
    }
});

app.controller('PlayListCtrl', function ($scope,$state, $location, Playlists, dataBank, dataFormatter, loader, dataSource, player, popup) {
    $scope.player = player;
    var limitStep=10;
    $scope.limit=limitStep;
    $scope.getMoreData=function()
    {
        //console.log("SDS");
        $scope.limit=$scope.limit+10;;
        console.log($scope.limit);
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    $scope.$on('$stateChangeSuccess', function() {
        //$scope.getMoreData();
    });
    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } else
    {
        $scope.isMainPanel = false;
    }
	$scope.myGoBack=function()
	{
		$state.go('tab.test');
	}
    $scope.searchChange = function(name)
    {
        if(name.length>0)
        {
            $scope.temp=$scope.limit;
            $scope.limit=dataBank.playlists.length;
        }
        else
        {
            $scope.limit=20;
        }
      
    }
    $scope.playlists = dataBank.playlists;
	console.log(JSON.stringify(dataBank.playlists));
});



app.controller('PlaylistDetailCtrl', function ($filter, dataBank, $scope, $location, $state, $stateParams, player, dataFormatter, dataSource, loader) {
    $scope.dataBank = dataBank;
    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }
    //$stateParams.playlistId - get the parameter on url  
    $scope.player = player;
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } else
    {
        $scope.isMainPanel = false;
    }

    $scope.myGoBack = function ()
    {
        $state.go('tab.test');
    };
    $scope.playlist = $filter('filter')(dataBank.playlists, function (d) {
        return d.id === $stateParams.playlistId;
    })[0];
	
    $scope.songs = $scope.playlist.songs;
    // alert("Playlist Detail: "+JSON.stringify($scope.songs));
});

app.controller('ArtistDetailCtrl', function ($filter, dataBank, $scope, $location, $state, $stateParams, player, dataFormatter, dataSource, loader) {
    $scope.dataBank = dataBank;
	var auth = localStorage.getItem("auth");
    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }
    //$stateParams.playlistId - get the parameter on url  
    $scope.player = player;
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } else
    {
        $scope.isMainPanel = false;
    }

    $scope.myGoBack = function ()
    {
        $state.go('tab.test');
    };
    $scope.artist = $filter('filter')(dataBank.artists, function (d) {
        return d.id === $stateParams.artistId;
    })[0];
	
     var request = dataSource.getArtistSongs(auth, $stateParams.artistId);
	  request.then(function(obj){
		$scope.songs = dataFormatter.songs(obj.data);
		if($scope.songs){
			console.log(JSON.stringify($scope.songs));
		  loader.hide();
		}
	  });
    // alert("Playlist Detail: "+JSON.stringify($scope.songs));
});


app.controller('AlbumDetailCtrl', function ($filter, dataBank, $scope, $location, $state, $stateParams, player, dataFormatter, dataSource, loader) {
    $scope.dataBank = dataBank;
	var auth = localStorage.getItem("auth");
    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }
    //$stateParams.playlistId - get the parameter on url  
    $scope.player = player;
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } else
    {
        $scope.isMainPanel = false;
    }

    $scope.myGoBack = function ()
    {
        $state.go('tab.test');
    };
	
	$scope.album = $filter('filter')(dataBank.albums, function (d) {
        return d.id === $stateParams.albumId;
    })[0]; 
	  
	var request = dataSource.getAlbumSongs(auth, $stateParams.albumId);
	  request.then(function(obj){
		$scope.songs = dataFormatter.songs(obj.data);
		if($scope.songs){
			console.log(JSON.stringify($scope.songs));
		  loader.hide();
		}
	  });
	  
   /*  $scope.album = $filter('filter')(dataBank.albums, function (d) {
        return d.id === $stateParams.albumId;
    })[0];
    $scope.songs = $scope.playlist.songs; */
    // alert("Playlist Detail: "+JSON.stringify($scope.songs));
});

app.controller('PlayerController', function ($rootScope, DownloadStatus, $cordovaToast, $cordovaLocalNotification, $cordovaFileTransfer, $timeout, $scope, player, audio, dataBank) {

    $scope.player = player;
    $scope.dataBank = dataBank;
    $scope.progressSatus = true;

    $scope.downloadProgress;
    currentTrack = player.songTitle;

    doubleZero = '00';

    //initialize values
    $scope.data = {};
    $scope.sec = doubleZero;
    $scope.min = doubleZero;
    $scope.max = doubleZero;
    $scope.mm = doubleZero;
    $scope.ss = doubleZero;
    $scope.data.seek = '0';

    $scope.testFileDownload = function ()
    {
        var url = player.songURL;
        filename = url.split("/").pop();
        filename = url.split("&").pop();
        filename = url.split("=").pop();

        // Save location
        var targetPath = cordova.file.externalRootDirectory + filename;
        var trustHosts = true;
        var options = {};

        player.download();
    };

    $scope.$watchCollection(DownloadStatus.isDownloading, function (newValue)
    {
        if (progressStatus[player.songTitle] == 1)
        {
            $scope.progressSatus = false;
        } else
        {
            $scope.progressSatus = true;
        }
    });

    $scope.$watchCollection(DownloadStatus.isDownloading2, function (newValue)
    {
        $scope.downloadProgress = newValue;
        alert(newValue);
    });

    //triggered by ngChange to update audio.currentTime
    $scope.seeked = function () {
        //console.log("AUDIO SEEKED: " + audio.currentTime);
        audio.currentTime = this.data.seek;
    };

    s = parseInt($scope.player.duration % 60, 10);
    m = parseInt(($scope.player.duration / 60) % 60, 10);

    $scope.sec = ('0' + s).slice(-2);
    $scope.min = ('0' + m).slice(-2);

    $scope.updateUI = function (min, sec, seek, max)
    {
        $scope.ss = ('0' + sec).slice(-2);
        $scope.mm = ('0' + min).slice(-2);
        $scope.max = max;
        $scope.data.seek = seek;
    };



    audio.addEventListener('timeupdate', function () {

        sec = parseInt(audio.currentTime % 60, 10);
        min = parseInt((audio.currentTime / 60) % 60, 10);
        seek = audio.currentTime;
        max = audio.duration;

        $timeout(function () {
            $scope.updateUI(min, sec, seek, max);
        }, 0);

        //angular.element('#seek').val(audio.currentTime);      
    });


    visible = false;
    plength = $scope.player.playlist.length;

    $scope.toggleQueue = function () {
        if (!visible && plength > 0) {
            angular.element("#queue").slideDown();
            visible = true;
        } else {
            angular.element("#queue").slideUp();
            visible = false;
        }
    };
});

app.controller('SessionController', function ( $filter,dataSource, dataBank, $scope, $location, $ionicSideMenuDelegate, $ionicModal, session, dataFormatter, loader, popup) 
{
   /* if (navigator.connection.type == Connection.NONE)
    {
        alert("NO INTERNET");
         //$state.go('tab.downloaded');
    }*/

    $scope.session = session;

    $scope.loginForm = 
    {
        username: "test",
        password: "test"
    };

    $scope.login = function () 
    {

        session.login($scope.loginForm.username, $scope.loginForm.password);

        var request = session.request;

        request.then(function (obj)
         {
            loader.hide();
            if (!obj.data) 
            {
                popup.showAlert("Invalid Login!", "Incorrect username or password.");
                //reset inputs
                $scope.loginForm.username = '';
                $scope.loginForm.password = '';
                //$location.url("/tab/player");//temp
            } 
			else
            {
                $scope.auth = dataFormatter.auth(obj.data);
                console.log("AUth: " + $scope.auth);
                if ($scope.auth) {
                    localStorage.setItem("auth", $scope.auth);

                    //console.log("AUTHORIZED");
                    //Authorized.... Now do rest// 

					/*
                      GET PLAYLIST
                   */
                    var request = dataSource.getPlaylists($scope.auth, '*', false);

                    request.then(function (obj)
                    {
                        result = dataFormatter.playlists(obj.data);
                        if (result.code) {
                            popup.showAlert('Session expired', 'Please login to your account.');
                            $location.url("/");
                        } else
                        {
                            $scope.items2 = [];
                            angular.forEach(result, function (item2)
                            {
                                var request2 = dataSource.getPlaylistSongs($scope.auth, item2.id);
                                request2.then(function (obj) {
                                    $scope.songs = dataFormatter.songs(obj.data);
                                    var obj = new Object();
                                    obj.name = item2.name;
                                    obj.id = item2.id;
                                    obj.items = item2.items;
                                    obj.songs = $scope.songs;
                                    $scope.items2.push(obj);
                                    dataBank.playlists = $scope.items2;
                                    if ($scope.songs)
                                    {
                                        console.log("TSGFSAFSAFSA");
                                        /* $scope.onePlaylist = $filter('filter')(dataBank.playlists, function (d) {
                                            return d.id === 15;
                                        })[0];
                        
                                     $scope.onePlaylistSongs = $scope.onePlaylist.songs;
                                      console.log("DATA BANK " + JSON.stringify($scope.onePlaylistSongs)+"\n\n\n\n\n\n\n");*/
                                    }

                                });

                            });


                        }

                    });
					/*
                        GET PLAYLIST DONE
                    */
					 
					/*
                        GET ARTIST
                    */
					var requestArtists = dataSource.getArtists($scope.auth,'',false);

                    requestArtists.then(function (obj)
                    {
						$scope.items3 = [];
                     
					    var artists= dataFormatter.artists(obj.data);
                        dataBank.artists=  artists ;
                 
						/*
                            GET ALBUMS
                        */
						var requestAlbums = dataSource.getAlbums($scope.auth,'',false);

						requestAlbums.then(function (obj)
						{
								$scope.items3 = [];
								//loader.hide();
								var albums= dataFormatter.albums(obj.data);
								//alert(artists.length);
								dataBank.albums=  albums ;
								//$scope.itemArtists = [];
								//dataBank.playlists = result;
								//console.log("DATA BANK ARTISTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: " + JSON.stringify(dataBank.artists)+"\n\n\n\n\n\n\n");
                               /* var request2 = dataSource.getPlaylistSongs($scope.auth, 15);
                                request2.then(function (obj) {
                                $scope.rock = dataFormatter.songs(obj.data);*/
								loader.hide();
								$location.url("/tab/test");

						});
						/*
                            GET ALBUMS DONE
                        */

                    });
					/*
                        GET ARTIST DONE
                    */
					
					
                }
            }
        });

        request.error(function (obj) {
            loader.hide();
            //console.log(obj);
            popup.showAlert("Timeout", "No connection to server!");
           //  $location.url("/tab/test");
        });
    };

});

app.controller('UserPlaylistCtrl', function ($scope,ConnectivityMonitor, $rootScope, $cordovaNetwork, $ionicPlatform) 
{
   
});

app.controller('SettingCtrl', function ($scope,ConnectivityMonitor, $rootScope, $cordovaNetwork, $ionicPlatform) 
{
    if (ConnectivityMonitor.isOnline()) 
    {
        $scope.connected = true;
       // alert("Connected");
       if (ConnectivityMonitor.isWifi()) 
       {
            alert("Using WIFI");
       }
    } else 
    {
        $scope.connected = false;
        alert("Not Connected");
    }
        
    var nS = window.localStorage.getItem('networkStatus');
    //console.log("nS: "+nS);
    if (nS === "wifi")
    {
        $scope.isChecked = true;
    }

    $scope.change = function (isChecked)
    {
        if (isChecked)
        {
            window.localStorage.setItem('networkStatus', 'wifi');
        } else
        {
            window.localStorage.setItem('networkStatus', 'all');
        }
        var appData = window.localStorage.getItem('networkStatus');
        //console.log(appData);
    }
});

app.controller('ArtistCtrl', function ($scope, $state,$location, Playlists, dataBank, dataFormatter, loader, dataSource, player, popup) 
{
	
	var limitStep=10;
	$scope.limit=limitStep;
	$scope.getMoreData=function()
	{
		//console.log("SDS");
		$scope.limit=$scope.limit+10;;
		console.log($scope.limit);
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}
	$scope.$on('$stateChangeSuccess', function() {
		//$scope.getMoreData();
	});
	$scope.myGoBack=function()
	{
		$state.go('tab.test');
	}
	$scope.searchChange = function(name)
    {
        if(name.length>0)
        {
            $scope.temp=$scope.limit;
            $scope.limit=dataBank.artists.length;
        }
        else
        {
            $scope.limit=20;
        }
      
    }
	$scope.artists=dataBank.artists;

    $scope.holdItem = function()
    {
        alert("HOLD");
    }
	/*$scope.auth=localStorage.getItem('auth');
	var requestArtists = dataSource.getArtists($scope.auth,'',false);

	requestArtists.then(function (obj)
	{
		$scope.items3 = [];
		//loader.hide();
			var artists= dataFormatter.artists(obj.data);
			dataBank.artists=  artists ;
			//$scope.itemArtists = [];
			//dataBank.playlists = result;
			console.log("DATA BANK ARTISTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: " + JSON.stringify(dataBank.artists));
			
			
		

	});*/
    $scope.player = player;
    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } else
    {
        $scope.isMainPanel = false;
    }
    $scope.artists = dataBank.artists;
});

app.controller('AlbumsCtrl', function ($scope, $state, $location, Playlists, dataBank, dataFormatter, loader, dataSource, player, popup) 
{
	var limitStep=10;
	$scope.limit=limitStep;
	$scope.getMoreData=function()
	{
		//console.log("SDS");
		$scope.limit=$scope.limit+10;;
		console.log($scope.limit);
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}
	$scope.$on('$stateChangeSuccess', function() {
		//$scope.getMoreData();
	});
	$scope.myGoBack=function()
	{
		$state.go('tab.test');
	}
	$scope.searchChange = function(name)
    {
        if(name.length>0)
        {
            $scope.temp=$scope.limit;
            $scope.limit=dataBank.albums.length;
        }
        else
        {
            $scope.limit=20;
        }
      
    }
	$scope.albums=dataBank.albums;
	/*$scope.auth=localStorage.getItem('auth');
	var requestArtists = dataSource.getArtists($scope.auth,'',false);

	requestArtists.then(function (obj)
	{
		$scope.items3 = [];
		//loader.hide();
			var artists= dataFormatter.artists(obj.data);
			dataBank.artists=  artists ;
			//$scope.itemArtists = [];
			//dataBank.playlists = result;
			console.log("DATA BANK ARTISTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: " + JSON.stringify(dataBank.artists));
			
			
		

	});*/
    $scope.player = player;
    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } 
	else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } 
	else
    {
        $scope.isMainPanel = false;
    }
    $scope.artists = dataBank.artists;
});

app.controller('TestController', function ($filter,dataBank, $window, MediaService, $window, $scope, $ionicPlatform, $stateParams, $location, Playlists, dataFormatter, player, loader, dataSource, popup)
{
    //Foot Bar of Player//
    $scope.audio = null;
    $scope.media = null;
     $scope.albums =dataBank.albums;
      $scope.playlist = $filter('filter')(dataBank.playlists, function (d) {
        return d.id === '12';
    })[0];
    
    $scope.songs = $scope.playlist.songs;
    alert("Playlist Detail: "+JSON.stringify($scope.songs));
    $scope.playMedia = function ()
    {
        var src = cordova.file.externalCacheDirectory + 'test.mp3';
        $window.resolveLocalFileSystemURL(src, function (dir) {

            basePath = dir.toInternalURL();

            $scope.media = MediaService.PlayMedia(basePath);
        });
    }

    $scope.playAudio = function () {
        alert("CLIKED");
        var src = cordova.file.cacheDirectory + "test.mp3";
        var src = src.replace('file://', '');
        alert(src);
        $window.resolveLocalFileSystemURL(src, function (dir) {

            basePath = dir.toInternalURL();
            media = $cordovaMedia.newMedia(basePath);
            var iOSPlayOptions = {
                numberOfLoops: 1,
                playAudioWhenScreenIsLocked: true
            };

            $scope.data.playing = true;

            media.play(); // Android
        });
    }

    $scope.goToPlayer = function ()
    {
        $location.url("tab/player");
    }

    //console.log("Foot Stts in Test: " + player.footStts);
    $scope.player = player;
    if ($scope.player.songTitle.localeCompare("No song loaded") == 0)
    {
        $scope.isMainPanel = true;
    } else if (!player.footStts)
    {
        $scope.isMainPanel = true;
    } else
    {
        $scope.isMainPanel = false;
    }
    //END Foot Bar of Player//


    /* SHOW PLAYLISTS */
    $scope.items2 = [];
    var playlistJSON;
    var auth = localStorage.getItem('auth');

    $scope.playlists2 = dataBank.playlists;
    
    console.log("TEST :"+ JSON.stringify($scope.playlists2) );
    
    $scope.artists =dataBank.artists;

    //$scope.rockSongs=$scope.playlists2[6];
    
   //console.log("TEST :"+ JSON.stringify($scope.playlists2[5]) );
     
    //$scope.artists=[];
    // alert(JSON.stringify(dataBank.artists));
    //for(var i=0;i<10;i++)
    //{
    //  $scope.artists.push(dataBank.artists[i]);
    //}



    $scope.items = [];
    $scope.oneItem = [];
});