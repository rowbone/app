module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';\n'
                    /*,
                                        sourceMap: true,
                                        sourceMapName: '<%= pkg.prod.path %>/conow-css.map'*/
            },
            /*cssFonts: {
                src: [
                      'css/conow-fonts.css',
                    //'vendor/fonts/source-sans-pro/source-sans-pro.css',
                    'vendor/fonts/font-awesome/css/font-awesome.min.css',
                    'vendor/fonts/simple-line-icons/css/simple-line-icons.css',
                    'vendor/fonts/ionicons/css/ionicons.min.css'
                ],
                dest: '<%= pkg.prod.path %>/conow-fonts-all.css'
            },
            cssVendors: {
                src: [
                    'vendor/libs/animate/animate.css', 
                    'vendor/plugins/jquery/sweet-alert/sweet-alert.css', 
                    'vendor/plugins/jquery/select2/select2.css',
                    'vendor/plugins/jquery/select2/select2-bootstrap.css',
                    'vendor/plugins/jquery/imageDetail/jquery.jqzoom.css',
                    'other/demo/conow-tabs/swiper3.07.min.css'
                ],
                dest: '<%= pkg.prod.path %>/conow-vendors-all.css'
            }*/

            // 合并ng依赖模块到app.ngVendors.js
            jsAppNgVendors: {
                src: [
                    'version.js',
                    'vendor/angular/angular-animate/angular-animate.min.js',
                    'vendor/libs/ngstorage/ngStorage.js',
                    'vendor/angular/angular-cookies/angular-cookies.min.js',
                    'vendor/angular/angular-resource/angular-resource.min.js',
                    'vendor/angular/angular-sanitize/angular-sanitize.min.js',
                    'vendor/angular/angular-touch/angular-touch.min.js',
                    'vendor/modules/angular-ui-router/angular-ui-router.min.js',
                    'vendor/modules/angular-ui-router-extras/ct-ui-router-extras.js',
                    'vendor/libs/oclazyload/ocLazyLoad.js',
                    'vendor/modules/angular-translate/angular-translate.min.js',
                    'vendor/modules/angular-translate/loader-static-files.js',
                    'vendor/modules/angular-translate/storage-cookie.js',
                    'vendor/modules/angular-translate/storage-local.js',
                    'vendor/bootstrap/js/bootstrap.min.js',
                ],
                dest: '<%= pkg.prod.path %>/app.ngVendors.js'
            },

            // 合并项目启动时需要加载的文件到app.start.js
            jsAppStart: {
                src: [
                    'js/arp.js',
                    'js/browser.js',
                    'js/app.js',
                    'js/services/accessConfig.js',
                    'common/app.pub.config.js',
                    
                    'config/app.arppub.config.js', // 各模块不同的config.js
                    
                    'config/IMPublicService.js',
                    
                    'js/config.js',
                    
                    'js/config.lazyload.js',
                    'js/config.router.js',
                    'common/access.router.js',
                    'js/main.js',
                    'js/services/ui-load.js',
                    'js/filters/fromNow.js',
                    'js/filters/htmlFormat.js',
                    'js/filters/pageFilter.js',
                    'js/directives/conow-layout/conow-loadingPage.js',
                    'js/directives/setnganimate.js',
                    'js/directives/conow-layout/conow-layout.js',
                    'js/directives/conow-modal/conow-modal.js',
                    'js/services/conow-renderCols.js',
                    'js/services/websocket.js',
                    'vendor/modules/reconnecting-websocket/reconnecting-websocket.js',
                    'js/services/UserDataService.js',
                    'js/services/conow-unsaved-warning.js',
                    'js/directives/conow-context/conow-context.js',
                    'js/directives/conow-progressbar/conow-progressbar.js',
                    'js/directives/conow-block-form/conow-block-form.js',
                    'js/directives/conow-navlist/conow-navlist.js',
                    'js/services/common-services.js',
                    'js/directives/conow-touch.js',
                    'js/directives/conow-utilities.js',
                    'js/directives/conow-bindHtmlCompile.js',
                    'js/services/conow-web-notification/notification.js',
                    'js/services/conow-web-notification/conow-web-notification-service.js'
                ],
                dest: '<%= pkg.prod.path %>/app.start.js'
            },

            // 合并ui配套组件到app.common.ui.js
            jsAppCommonUI: {
                src: [
                    'js/directives/ui-focus.js',
                    'js/directives/ui-fullscreen.js',
                    'js/directives/ui-module.js',
                    'js/directives/ui-nav.js',
                    'js/directives/ui-scroll.js',
                    'js/directives/ui-shift.js',
                    'js/directives/ui-toggleclass.js',
                ],
                dest: '<%= pkg.prod.path %>/app.common.ui.js'
            },

            // 合并其他组件到app.common.others.js
            jsAppCommonOther: {
                src: [
                    'js/services/conow-renderCols.js',

                    'js/directives/conow-imageDetail.js',
                    'vendor/plugins/jquery/imageDetail/unslider.js',
                    'vendor/plugins/jquery/imageDetail/jquery.event.swipe.js',
                    'vendor/plugins/jquery/imageDetail/jquery.event.move.js',
                    'js/directives/conow-picturePreview.js',

                    'vendor/plugins/jquery/equalheights/jquery.equalheights.js',

                    'js/directives/conow-staffphoto/conow-staffphoto-directive.js',
                    'js/directives/conow-staffinfo/js/conow-staffinfo-directive.js',

                    'js/components/conowMomentumScroll/iScroll.js',
                    'js/components/conowMomentumScroll/conowMomentumScroll.js',
                    'js/components/conowScrollablePicker/conowScrollablePicker.js',
                    'js/directives/modalTrigger.js',
                    'js/directives/conowBreadcrumb/conowBreadcrumb.js',
                    'vendor/modules/3rd/uuid/uuid.js',
                    
                    // 附件预览
                    'js/directives/conow-appendix-display/appendix-displayDemo.js',
                    'js/directives/conow-preview-file/conow-preview-file.js',
                    
                    // 分页
  			       'js/directives/conow-pagination/js/conow-pagination.js'
                ],
                dest: '<%= pkg.prod.path %>/app.common.others.js'
            },

            // 合并所有选择组件到app.components.pickers.js
            jsAppComponentsPicker: {
                src: [
                    'js/angular-locale_zh-cn.js',
                    'js/directives/conow-timeSelect/dateCommond.js',
                    'js/directives/conow-timeSelect/service/dateHandleServ.js',
                    'js/directives/conow-timeSelect/conow-timeSelectNew.js',
                    'js/directives/conow-orgchoose/js/conow-orgchoose.js',
                    'js/directives/conow-budget-org/js/conow-budget-org.js',
                    'js/directives/conow-staffchoose/services/conowStaffChooseService.js',
                    'js/directives/conow-staffchoose/js/conow-staffchoose.js',
                    'js/directives/conow-picker/conow-picker.js',
                    'js/directives/conow-dict-picker/conow-dict-picker.js',
                    'js/directives/conow-select.js',
                    'js/directives/conow-selectdict.js',

                    'js/directives/dictDataSrc.js',

//                    'js/directives/conow-area/js/area-services.js',
//                    'js/directives/conow-area/js/area-filters.js',
//                    'js/directives/conow-area/js/conow-area.js',                    

                    'js/directives/conow-alphabet-group/js/conow-alphabet-group-sel.js',
                ],
                dest: '<%= pkg.prod.path %>/app.components.pickers.js'
            },

            // 合并所有用户编辑控件到app.components.editors.js
            jsAppComponentsEditors: {
                src: [
                    'js/directives/conow-stepper/conow-stepper.js',
                    'other/demo/conow-audio-textarea/conow-audio-textarea-service.js',
                    'other/demo/conow-audio-textarea/conow-audio-textarea.js',
                    'js/directives/conow-audition/conow-audition.js',
                    'js/directives/conow-audio-player/conow-audio-player-service.js',
                    'js/directives/conow-audio-player/conow-audio-player.js',
                    'js/directives/conow-editor.js',
                    'vendor/modules/angular-elastic-input/angular-elastic-input.js',
                ],
                dest: '<%= pkg.prod.path %>/app.components.editors.js'
            },

            // 合并文件上传组件到app.components.fileupload.js
            jsAppComponentsFileupload: {
                src: [
                    'js/services/conow-fileUpload-service.js',
                    'js/directives/conowFileUpload/conow-fileUpload.js',
                    'js/directives/conow-simpleFileUpload.js',
                    'js/directives/conow-fileUpload-oldList.js',
                ],
                dest: '<%= pkg.prod.path %>/app.components.fileupload.js'
            },

            // 页签组件
            jsAppComponentsTabs: {
                src: [
                    'js/directives/conow-tabs.js',
                    'js/services/conowTabsService.js',
                    //'other/demo/conow-tabs/swiper3.07.min.js',

                ],
                dest: '<%= pkg.prod.path %>/app.components.tabs.js'
            },
            /*jsAppCommonUI: {
                src: [
                ],
                dest: '<%= pkg.prod.path %>/app.start.js'
            }*/
        },

        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.prod.path %>',
                    src: '**/*.js',
                    dest: '<%= pkg.prod.path %>'
                }]
            }
        },
        // qunit: {
        //     files: ['test/**/*.html']
        // },
        jshint: {
            files: ['Gruntfile.js', '<%= pkg.src.path %>/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        copy: {
            main: {
                files: [

                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: '<%= pkg.src.path %>/',
                        src: ['**'],
                        dest: '<%= pkg.prod.path %>/'
                    }
                ],
            },
            generated: {
                src: 'index.html',
                dest: 'prod/index.html'
            },
            afterConcat: {
                files: [

                    // makes all src relative to cwd
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'prod/concat',
                        src: ['**/**.css'],
                        dest: 'prod/css/',
                        filter: 'isFile'
                    }, {
                        expand: true,
                        flatten: true,
                        cwd: 'prod/concat',
                        src: ['**/**.js'],
                        dest: 'prod/js/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        clean: {
            prod: ["<%= pkg.prod.path %>"],
            afterConcat: ['prod/concat']
        },
        // watch: {
        //   files: ['<%= jshint.files %>'],
        //   tasks: ['jshint', 'qunit']
        // }
        
        cachebreaker: {
            prod: {
                options: {
                    match: [
                        {
                            // Pattern    // File to hash
                        	'css/app.css': 'css/app.css',
                        	'vendor/fonts/conowicon/css/conow-iconfont.css': 'vendor/fonts/conowicon/css/conow-iconfont.css',
                        	
                            'prod/app.ngVendors.js': 'prod/app.ngVendors.js',
                            'prod/app.start.js':    'prod/app.start.js',

                            'prod/app.common.ui.js': 'prod/app.common.ui.js',
                            'prod/app.common.others.js': 'prod/app.common.others.js',
                            'prod/app.components.pickers.js': 'prod/app.components.pickers.js',
                            'prod/app.components.editors.js': 'prod/app.components.editors.js',
                            'prod/app.components.fileupload.js': 'prod/app.components.fileupload.js',
                            'prod/app.components.tabs.js': 'prod/app.components.tabs.js'
                        }
                    ],
                    replacement: 'md5'
                },
                files: {
                    src: [
                        'index.html',
                        'js/config.lazyload.js'
                    ]
                }
            }
        },

        filerev : {
            build : {
                files : [{
                        src : ['<%= pkg.prod.path %>/*.js'],
                        dest: '<%= pkg.prod.path %>'
                    }
                ]
            }
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'prod',
                staging: 'prod'
            }
        },
        usemin: {
            html: 'prod/index.html',
            options: {
                assetsDirs: ['prod']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-qunit');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-cache-breaker');

    // grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', ['concat',  'cachebreaker', /*'jshint', 'qunit', 'concat', 'clean:prod','copy', 'uglify'*/ ]);

    /*grunt.registerTask('default', [
                                   'copy:generated',
                                   'useminPrepare',
                                   'concat:generated',
                                   //'cssmin:generated',
                                   //'uglify:generated',
                                   //'filerev',
                                   'copy:afterConcat',
                                   'clean:afterConcat',
                                   'usemin'
                                   ]);*/

};
