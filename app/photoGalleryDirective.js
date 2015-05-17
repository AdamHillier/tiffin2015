'use strict';
angular.module('tiffin2015').directive('tifPhotoGallery', ['ContentService', '$window', function (contentService, $window) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var maxHeight = 250;

            var photos;
            var photoElements;

            function adjustHeights(eWidth) {
                if (!photos || !photoElements) { return; }

                var row = [];
                var runningWidth = 0;
                var rowWidth = eWidth

                for (var i = 0; i < photos.length; i++) {
                    var iWidth = photos[i].thumbAspectRatio * maxHeight;

                    row.push(i);
                    runningWidth += iWidth;
                    rowWidth -= 6;

                    if (runningWidth >= rowWidth) {
                        var height = maxHeight * rowWidth/runningWidth;
                        for (var j = 0; j < row.length; j++) {
                            photoElements[row[j]].style.height = height + 'px';
                            photoElements[row[j]].style.width = height * photos[row[j]].thumbAspectRatio + 'px';
                        }
                        row = [];
                        runningWidth = 0;
                        rowWidth = eWidth;
                    }
                }
            }

            scope.$watch('photos', function (values) {
                photos = values.photos;
                photoElements = element.children();
                adjustHeights(element[0].clientWidth);
            });

            angular.element($window).bind('resize', function () {
                adjustHeights(element[0].clientWidth);
            });
        }
    };
}]);
