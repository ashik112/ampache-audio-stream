// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionicLazyLoad', 'ionic.contrib.ui.hscrollcards', 'ionic.contrib.drawer', 'starter.controllers', 'starter.services', 'starter.directives', 'ngCordova'])
		
		/* .config(function($ionicConfigProvider){
			//Disable Page transitions for slow mobile
				$ionicConfig.views.transition('none');
		}) */
		
        .run(function ($ionicPlatform, $rootScope, $ionicLoading, loader,ConnectivityMonitor) {
            $ionicPlatform.ready(function () {
				
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                var appData = window.localStorage.getItem('networkStatus');
                if (ConnectivityMonitor.isOnline())
                {

                    if (appData === "wifi")
                    {
                        if (ConnectivityMonitor.isWifi())
                        {
                            alert("Using WIFI");
                        }
                        else
                        {
                            alert("Please Connect to WIFI");
                            //$location.url("tab/setting");
                        }
                    }
                   
                } else
                {
                   //  $location.url("tab/downloaded");                   
                }
//                if (appData === "wifi")
//                {
//                    alert("wifi needed");
//                }
            });

            $rootScope.$on('loading-started', function () {
                // console.log('loading');    
            });

            $rootScope.$on('loading-complete', function () {
                // console.log('complete');
            });
        })

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    //setup abstract state for home
                    .state('home', {
                        url: "/home",
                        templateUrl: "templates/home.html",
                        controller: "SessionController"
                    })

                    // setup an abstract state for the tabs directive
                    .state('tab', {
                        url: "/tab",
                        abstract: true,
                        templateUrl: "templates/tabs.html",
                        controller: "SessionController"
                    })


                    .state('player', {
                        cache: false,
                        url: "/player",
                        templateUrl: "templates/tab-player.html",
                        controller: "PlayerController"
                    })


                    // Each tab has its own nav history stack:
                    .state('tab.player', {
                        url: '/player',
                        views: {
                            'menuPlayer': {
                                templateUrl: 'templates/tab-player.html',
                                controller: 'PlayerController'
                            }
                        }
                    })
					
					 .state('playlist', {
                        url: "/playlist",
                        templateUrl: "templates/tab-playlist.html",
                        controller: "PlayListCtrl"
                    })


                   /*  .state('playlist', {
						 cache: false,
                        url: '/playlist',
                        views: {
                            'menuPlaylist': {
                                templateUrl: 'templates/tab-playlist.html',
                                controller: 'PlayListCtrl'
                            }
                        }
                    }) */

                    .state('tab.playlist-detail', {
                        url: '/playlist/:playlistId',
                        views: {
                            'menuPlaylist': {
                                templateUrl: 'templates/playlist-detail.html',
                                controller: 'PlaylistDetailCtrl'
                            }
                        }
                    })
					
					.state('artist', {
                        url: '/artist',                
						templateUrl: 'templates/tab-artist.html',
						controller: 'ArtistCtrl'                            
                        })
						
					.state('albums', {
						url: '/albums',
						templateUrl: 'templates/tab-albums.html',
						controller: 'AlbumsCtrl'  
					}) 
                    
					.state('tab.artist-detail', {
                        url: '/artist/:artistId',
                        views: {
                            'menuArtist': {
                                templateUrl: 'templates/artist-detail.html',
                                controller: 'ArtistDetailCtrl'
                            }
                        }
                    })
					
					.state('tab.album-detail', {
                        url: '/album/:albumId',
                        views: {
                            'menuAlbums': {
                                templateUrl: 'templates/album-detail.html',
                                controller: 'AlbumDetailCtrl'
                            }
                        }
                    })
					
					/* .state('tab.artist', {
						 cache: false,
                        url: '/artist',
                        views: {
                            'menuArtist': {
                                templateUrl: 'templates/tab-artist.html',
                                controller: 'ArtistCtrl'
                            }
                        }
                    }) */
					
					/* .state('tab.albums', {
						 cache: false,
                        url: '/albums',
                        views: {
                            'menuAlbums': {
                                templateUrl: 'templates/tab-albums.html',
                                controller: 'AlbumsCtrl'
                            }
                        }
                    }) */

                    .state('tab.library', {
                        url: '/library',
                        views: {
                            'menuLibrary': {
                                templateUrl: 'templates/tab-library.html',
                                controller: 'LibraryCtrl'
                            }
                        }
                    })

                    .state('tab.test', {
						  cache: true,
                        url: '/test',
                        views: {
                            'menuTest': {
                                templateUrl: 'templates/tab-home.html',
                                controller: 'TestController'
                            }
                        }
                    })

                    .state('tab.about', {

                        url: '/about',
                        views: {
                            'menuAbout': {
                                templateUrl: 'templates/tab-about.html'
                            }
                        }
                    })

                    .state('tab.downloaded', {

                        url: '/downloaded',
                        views: {
                            'menuDownloaded': {
                                templateUrl: 'templates/tab-downloaded.html',
                                controller: 'DownloadedCtrl'
                            }
                        }
                    })

                    .state('tab.userPlaylist', {

                        url: '/userPlaylist',
                        views: {
                            'menuUserPlaylist': {
                                templateUrl: 'templates/tab-userPlaylist.html',
                                controller: 'UserPlaylistCtrl'
                            }
                        }
                    })

                    .state('tab.setting', {

                        url: '/setting',
                        views: {
                            'menuSetting': {
                                templateUrl: 'templates/tab-setting.html',
                                controller: 'SettingCtrl'
                            }
                        }
                    })

                    .state('tab.library-detail', {
                        url: '/library/:libraryId',
                        views: {
                            'menuLibrary': {
                                templateUrl: 'templates/library-detail.html',
                                controller: 'LibraryDetailCtrl'
                            }
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/home');

            $httpProvider.interceptors.push('myHttpInterceptor');

        });

