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
            templateUrl: 'partials/photos.html',
            resolve: {
                photos: ['ContentService', function (contentService) {
                    return contentService.getPhotos();
                }]
            },
            controller: 'PhotosController',
            controllerAs: 'photos'
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
        })
        .state('forms', {
            url: '/forms',
            templateUrl: 'partials/forms.html',
            resolve: {
                forms: ['ContentService', function (contentService) {
                    return contentService.getForms();
                }]
            },
            controller: 'FormsController',
            controllerAs: 'forms'
        });

    cfpLoadingBarProvider.latencyThreshold = 100;
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
