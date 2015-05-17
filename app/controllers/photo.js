'use strict';
angular.module('tiffin2015').controller('PhotoController', ['photo', '$state', function (photo, $state) {
    if (!photo) {
        return $state.go('photos.gallery');
    }
    this.file = photo.file;
}]);
