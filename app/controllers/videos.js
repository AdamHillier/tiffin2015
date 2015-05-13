'use strict';
angular.module('tiffin2015').controller('VideosController', ['videos', '$sce', function (videos, $sce) {
    for (var i = 0; i < videos.length; i++) {
        videos[i].url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videos[i].youtubeCode + '?fs=1&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&theme=light');
    }
    console.log(videos);
    this.videos = videos;
}]);
