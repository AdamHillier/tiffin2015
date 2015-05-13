module.exports = function(grunt) {

    var JS_VENDOR_FILES = ['bower_components/angular/angular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-loading-bar/build/loading-bar.min.js',
            'bower_components/ngDialog/js/ngDialog.min.js'];
    var JS_APP_FILES = ['app/app.js', 'app/controllers/*', 'app/contentService.js'];
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

    grunt.registerTask('populateDb', function () {
        var done = this.async();

        var mongoose = require('mongoose');
        var Photo = require('./server/models/photo');
        var Video = require('./server/models/video');
        var Form = require('./server/models/form');

        var photos = require('./data/photos');
        var videos = require('./data/videos');
        var forms = require('./data/forms');

        mongoose.connect(require('./server/config/database').url);
        mongoose.connection.once('open', function () {
            grunt.log.writeln('Database connected');
            Promise.all([Photo.remove({}).exec(), Video.remove({}).exec(), Form.remove({}).exec()])
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

    grunt.registerTask('default',
            ['populateDb', 'clean:all', 'concat', 'htmlmin', 'cssmin', 'uglify', 'concurrent']);

};
