angular.module('tiffin2015').service('ContentService', ['$http', '$q', function ($http, $q) {
        var URL = 'http://localhost.adamhillier.eu:3000';

        var photos, videos, forms;

        this.getPhotos = function () {
            if (!photos) {
                photos = $http.get(URL + '/photos')
                .then(function (data) {
                    data.data.sort(function (a, b) {
                        if (a.date < b.date) { return -1; }
                        return 1;
                    });
                    return data.data;
                }, function (data, status, headers) {
                    console.log('An error occured.');
                    return new Error('An error occurred.');
                });
            }
            return photos;
        }
        this.getPhoto = function (file) {
            function findPhoto(photos) {
                for (var i = 0; i < photos.length; i++) {
                    if (photos[i].file === file) {
                        return photos[i];
                    }
                }
                return null;
            }
            return photos.then(function (photos) {
                return findPhoto(photos);
            })
        }
        this.getVideos = function () {
            if (!videos) {
                videos = $http.get(URL + '/videos')
                .then(function (data) {
                    /*data.data.sort(function (a, b) {
                        if (a.form < b.form) { return 1; }
                        return -1;
                    });*/
                    return data.data;
                }, function (data, status, headers) {
                    console.log('An error occured.');
                    return new Error('An error occurred.');
                });
            }
            return videos;
        }
    }]);
