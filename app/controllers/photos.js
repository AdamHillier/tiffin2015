'use strict';
angular.module('tiffin2015').controller('PhotosController', ['photos', '$state', function (photos, $state) {
    this.photos = photos;
    this.open = function (file) {
        $state.go('photos.photo', { photoFile: file });
    }
}]);
