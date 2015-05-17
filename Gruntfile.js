module.exports = function(grunt) {

    var JS_VENDOR_FILES = ['bower_components/angular/angular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-loading-bar/build/loading-bar.min.js',
            'bower_components/ngDialog/js/ngDialog.min.js'];
    var JS_APP_FILES = ['app/app.js', 'app/controllers/*', 'app/contentService.js', 'app/photoGalleryDirective.js'];
    var CSS_FILES = ['bower_components/pure/pure-nr.css',
            'bower_components/angular-loading-bar/build/loading-bar.min.css',
            'app/css/app.css'];

    grunt.initConfig({
        clean: {
            all: ['public/*'],
            html: ['public/**/*.html'],
            css: ['public/**/*.css'],
            js: ['public/**/*.js']
        },
        concat: {
            vendorJs: {
                src: JS_VENDOR_FILES,
                dest: 'public/vendor.min.js'
            }
        },
        htmlmin: {
            options: {
                collapseWhitespace: true,
                removeComments: true
            },
            files: {
                src: '**/*.html',
                dest: 'public',
                cwd: 'app',
                expand: true
            }
        },
        cssmin: {
            files: {
                src: CSS_FILES,
                dest: 'public/app.min.css'
            }
        },
        uglify: {
            app: {
                src: JS_APP_FILES,
                dest: 'public/app.min.js'
            }
        },
        watch: {
            html: {
                files: 'app/**/*.html',
                tasks: ['clean:html', 'htmlmin']
            },
            css: {
                files: CSS_FILES,
                tasks: ['clean:css', 'cssmin']
            },
            js: {
                files: JS_VENDOR_FILES.concat(JS_APP_FILES),
                tasks: ['clean:js', 'concat:vendorJs', 'uglify']
            }
        },
        nodemon: {
            dev: {
                script: 'server/server.js',
                options: {
                    watch: ['public', 'server']
                }
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    function processImages(done) {
        var dir = require('node-dir');
        var path = require('path')
        var gm = require('gm');
        var uuid = require('node-uuid');
        var fs = require('fs');

        var photos = [];

        dir.readFiles(path.join(__dirname, 'auto_add_photos'), { match: /.(jpg|jpeg|JPG|JPEG)$/, encoding: null },
            function (err, content, filename, next) {
                var photo = gm(content);
                photo.identify(function (err, data) {
                    try {
                        var dateTime = data['Profile-EXIF']['Date Time Original'].split(' ');
                        var d = dateTime[0].split(':');
                        var t = dateTime[1].split(':');
                        var date = new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2]);
                    } catch (err) {
                        var stat = fs.statSync(filename);
                        if (stat.birthtime) {
                            var date = stat.birthtime;
                        } else {
                            throw new Error('Could not read metadata from file.');
                        }
                    }
                    var file = uuid.v4({ rng: uuid.nodeRNG }) + '.jpg';
                    photo.write(path.join(__dirname, 'photos', file), function (err) {
                        if (err) { throw err; }
                        photo.autoOrient().resize(null, 400).noProfile().write(path.join(__dirname, 'photos/thumb', file), function (err) {
                            if (err) { throw err; }
                            var meta = {
                                file: file,
                                date: date,
                                width: data.size.width,
                                height: data.size.height,
                                thumbAspectRatio: Math.round(500*data.size.width/data.size.height)/500
                            }
                            photos.push(meta);
                            next();
                        });
                    });
                });
            },
            function (err, files) {
                if (err) { throw err; }
                try {
                    for (var i = 0; i < files.length; i++) {
                        fs.unlinkSync(files[i]);
                    }
                } catch (err) {
                    throw err;
                }
                done(photos);
            });
    }

    /*
    ** Will delete existing forms and videos, replacing them with the contents of the JSON
    ** files in /data, but will *add* photos (existing photos are not deleted).
    */
    grunt.registerTask('populateDb', function () {
        var done = this.async();

        var mongoose = require('mongoose');
        var Photo = require('./server/models/photo');
        var Video = require('./server/models/video');
        var Form = require('./server/models/form');

        var videos = require('./data/videos');
        var forms = require('./data/forms');

        processImages(function (photos) {
            mongoose.connect(require('./server/config/database').url);
            mongoose.connection.once('open', function () {
                grunt.log.writeln('Database connected');
                Promise.all([Video.remove({}).exec(), Form.remove({}).exec()])
                    .then(function () {
                        grunt.log.writeln('Collections emptied');
                        Promise.all([Photo.create(photos), Video.create(videos), Form.create(forms)])
                            .then(function () {
                                grunt.log.writeln('Collections populated');
                                done();
                            }, function () {
                                grunt.log.writeln('Error: collections could not be populated.');
                                done(false);
                            });
                    }, function () {
                        grunt.log.writeln('Error: collections could not be emptied.');
                        done(false);
                    })
            });
        });
    });

    grunt.registerTask('default',
            ['populateDb', 'clean:all', 'concat', 'htmlmin', 'cssmin', 'uglify', 'concurrent']);

};
