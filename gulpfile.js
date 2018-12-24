/* globals __dirname, process */

var gulp = require('gulp');
var ngLibsPath = './src/libs/ngLibs/';
var jsLibsPath = './src/libs/';
var jsWidgetPath = './src/widget/';
var cssPath = './src/css';
var libsJsPath = [  
    ngLibsPath + '**/**.js',
    jsLibsPath + 'jQLibs/**/**.js',
    '!./src/widget/czMobile/{dist,gruntfile.js,GruntFile.js,GulpFile.js}',
    jsWidgetPath + '**/*.js',
    jsWidgetPath + 'czMobile/src/js/czMobile.all.js'
];
var cssModelsPath = [
    cssPath + 'iconfont.css',
    cssPath + 'common.css',
    cssPath + 'theme.css',
    jsWidgetPath + '**/**/**.css',
    jsLibsPath + '**/**/**.css',
    ngLibsPath + '**/**.css'
];

// 引入组件
var concat = require('gulp-concat');

var gulpFlieInitConfig = function(){
    return {
        scripts: function(cb) {
            gulp.src(libsJsPath)                       
                    .pipe(concat('libs.all.js'))
                    .pipe(gulp.dest('./src/build'));

            gulp.src('./src/libs/***/**/**.css')                       
                    .pipe(concat('libs.all.css'))
                    .pipe(gulp.dest('./src/build'));

            gulp.src('./src/directives/**/**.js')                       
                    .pipe(concat('model.all.js'))
                    .pipe(gulp.dest('./src/build'));

            gulp.src('./src/directives/**/**.css')                       
                    .pipe(concat('model.all.css'))
                    .pipe(gulp.dest('./src/build'));
        }
    };
}();


for (var i in gulpFlieInitConfig){
    if (typeof gulpFlieInitConfig[i] === 'function') {
        gulp.task(i, gulpFlieInitConfig[i]);
    } else {
        gulp.task(i, gulpFlieInitConfig[i][1], gulpFlieInitConfig[i][0]);
    }
}

// 默认任务
gulp.task('default', ['scripts']);
