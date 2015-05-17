'use strict';
angular.module('tiffin2015', ['ui.router', 'ngAnimate', 'angular-loading-bar', 'ngDialog'])
        .config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', 'ngDialogProvider',
                function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, ngDialogProvider) {
    //$locationProvider.html5Mode({ enabled: true, requireBase: false }).hashPrefix('!');
    $urlRouterProvider.otherwise('/yearbook');
    $stateProvider
        .state('yearbook', {
            url: '/yearbook',
            templateUrl: 'partials/yearbook.html'
        })
        .state('photos', {
            url: '/photos',
            abstract: true,
            template: '<ui-view/>',
            resolve: {
                photos: ['ContentService', function (contentService) {
                    return contentService.getPhotos();
                }]
            },
        })
        .state('photos.gallery', {
            url: '',
            templateUrl: 'partials/photos.html',
            controller: 'PhotosController',
            controllerAs: 'photos'
        })
        .state('photos.photo', {
            url: '/:photoFile',
            templateUrl: 'partials/photo.html',
            resolve: {
                photo: ['ContentService', '$stateParams', function (contentService, $stateParams) {
                    return contentService.getPhoto($stateParams.photoFile);
                }]
            },
            controller: 'PhotoController',
            controllerAs: 'photo'
        })
        .state('videos', {
            url: '/videos',
            templateUrl: 'partials/videos.html',
            resolve: {
                videos: ['ContentService', function (contentService) {
                    return contentService.getVideos();
                }]
            },
            controller: 'VideosController',
            controllerAs: 'videos'
        });

    cfpLoadingBarProvider.latencyThreshold = 50;
    cfpLoadingBarProvider.includeSpinner = false;

    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        template: '<p>An error occurred :( Please reload the page and try again.</p><a class=\'button\' ng-click=\'$window.location.reload();\'>Reload page</a>',
        plain: true,
        showClose: false,
        closeByDocument: false,
        closeByEscape: false
    });
}]);
