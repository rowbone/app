
angular.module('app')
/**
 * 使用ui-jq指令配置所需的jQuery插件
 * key: 定义jQuery插件的函数名
 * value: js或css文件
 */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['vendor/plugins/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
      sparkline:      ['vendor/plugins/jquery/charts/sparkline/jquery.sparkline.min.js'],
      plot:           ['vendor/plugins/jquery/charts/flot/jquery.flot.min.js',
                          'vendor/plugins/jquery/charts/flot/jquery.flot.resize.js',
                          'vendor/plugins/jquery/charts/flot/jquery.flot.tooltip.min.js',
                          'vendor/plugins/jquery/charts/flot/jquery.flot.spline.js',
                          'vendor/plugins/jquery/charts/flot/jquery.flot.orderBars.js',
                          'vendor/plugins/jquery/charts/flot/jquery.flot.pie.js'],
      slimScroll:     ['vendor/plugins/jquery/slimscroll/jquery.slimscroll.min.js'],
      sortable:       ['vendor/plugins/jquery/sortable/jquery.sortable.js'],
      nestable:       ['vendor/plugins/jquery/nestable/jquery.nestable.js',
                          'vendor/plugins/jquery/nestable/nestable.css'],
      filestyle:      ['vendor/plugins/jquery/filestyle/bootstrap-filestyle.js'],
      slider:         ['vendor/plugins/jquery/slider/bootstrap-slider.js',
                          'vendor/plugins/jquery/slider/slider.css'],
      chosen:         ['vendor/plugins/jquery/chosen/chosen.jquery.min.js',
                          'vendor/plugins/jquery/chosen/chosen.css'],
      TouchSpin:      ['vendor/plugins/jquery/touchspin/jquery.bootstrap-touchspin.min.js',
                          'vendor/plugins/jquery/touchspin/jquery.bootstrap-touchspin.css'],
      wysiwyg:        ['vendor/plugins/jquery/wysiwyg/bootstrap-wysiwyg.js',
                          'vendor/plugins/jquery/wysiwyg/jquery.hotkeys.js'],
      dataTable:      ['vendor/plugins/jquery/datatables/jquery.dataTables.js',
                          'vendor/plugins/jquery/datatables/dataTables.bootstrap.js',
                          'vendor/plugins/jquery/datatables/dataTables.bootstrap.css'],
      vectorMap:      ['vendor/plugins/jquery/jvectormap/jquery-jvectormap.min.js',
                          'vendor/plugins/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                          'vendor/plugins/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                          'vendor/plugins/jquery/jvectormap/jquery-jvectormap-cn-mill-en.js',
                          'vendor/plugins/jquery/jvectormap/jquery-jvectormap.css'],
      footable:       ['vendor/plugins/jquery/footable/footable.all.min.js',
                          'vendor/plugins/jquery/footable/footable.core.css']
      }
  )
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      $ocLazyLoadProvider.config({
          debug:  false,
          events: true,
          modules: [
              {
                  name: 'ngGrid',
                  files: [
                      'vendor/modules/ng-grid/ng-grid.js',
                      'vendor/modules/ng-grid/ng-grid.min.css',
                      'vendor/modules/ng-grid/theme.css'
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      'vendor/modules/angular-ui-select/select.min.js',
                      'vendor/modules/angular-ui-select/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    'vendor/modules/angular-file-upload/angular-file-upload.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['vendor/modules/angular-ui-calendar/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      'vendor/modules/ngImgCrop/ng-img-crop.js',
                      'vendor/modules/ngImgCrop/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      'vendor/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
                      'vendor/modules/angular-bootstrap-nav-tree/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      'vendor/modules/angularjs-toaster/toaster.js',
                      'vendor/modules/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      'vendor/modules/textAngular/textAngular-sanitize.min.js',
                      'vendor/modules/textAngular/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      'vendor/modules/angular-slider/angular-slider.js',
                      'vendor/modules/angular-slider/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      'vendor/modules/videogular/plugins/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      'vendor/modules/videogular/plugins/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      'vendor/modules/videogular/plugins/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      'vendor/modules/videogular/plugins/ima-ads.min.js'
                  ]
              }
          ]
      });
  }])
;