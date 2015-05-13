angular.module('tiffin2015').service('ContentService', ['$http', '$q', function ($http, $q) {
        var URL = 'http://localhost.adamhillier.eu:3000';

        var photos, videos, forms;

        this.getPhotos = function () {
            console.log('getPhotos');
            if (!photos) {
                photos = $http.get(URL + '/photos').success(function (data) {
                    console.log('success');
                    return data.data;
                }).error(function (data, status, headers) {
                    console.log('An error occured.');
                    return new Error('An error occurred.');
                });
            }
            return photos;
        }
        this.getVideos = function () {
            console.log('getVideos');
            if (!videos) {
                videos = $http.get(URL + '/videos')
                .then(function (data) {
                    console.log('success');
                    console.log(data.data);
                    return data.data;
                }, function (data, status, headers) {
                    console.log('An error occured.');
                    return new Error('An error occurred.');
                });
            }
            return videos;
        }
        this.getForms = function () {
            console.log('getForms');
            if (!forms) {
                forms = $http.get(URL + '/forms').success(function (data) {
                    console.log('success');
                    return data.data;
                }).error(function (data, status, headers) {
                    console.log('An error occured.');
                    return new Error('An error occurred.');
                });
            }
            return forms;
        }
    }]);
