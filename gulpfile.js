/* globals __dirname, process */

var gulp = require('gulp');

// 引入组件
var concat = require('gulp-concat');

var gulpFlieInitConfig = function(){
    return {
        scripts: function(cb) {
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
