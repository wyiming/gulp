var gulp = require('gulp');
var uglify = require('gulp-uglify');
// var concat = require('gulp-concat'); //- 多个文件合并为一个；
var minifyCss = require('gulp-clean-css'); //- 压缩CSS为一行；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var del = require('del');
var imagemin = require('gulp-imagemin'); //图片压缩
gulp.task('cssmin', function() { //- 创建一个名为 concat 的 task   gulp.src(['./src/css/*.css'])
    return gulp.src(['webapp/**/*.css']) //  .pipe(concat('wrap.min.css'))              //- 合并后的文件名
        .pipe(minifyCss()) //- 压缩处理成一行
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('maven/')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/revcss/')) //- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('jsmin', function() {
    return gulp.src(['webapp/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('maven/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/revjs/'))
})
gulp.task('rev', ['cssmin', 'jsmin', 'images'], function() {
    //此处数字内的任务要依赖rev这个任务需先数组的内容在执行rev保证第一次就能替换html的URL  必须在gulp.src之前加return才行
    return gulp.src(['rev/*/*.json', 'webapp/**/*.html', 'webapp/*.html'])
        //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())
        //- 执行文件内css名的替换
        .pipe(gulp.dest('maven/'));
    //- 替换后的文件输出的目录
});


gulp.task('images', function() {
    return gulp.src(['webapp/**/*.{png,jpg,gif,ico}'])
        .pipe(imagemin())
        .pipe(gulp.dest('maven/'));
    //- 替换后的文件输出的目录
});
gulp.task('clean', function(cb) {
    del(['maven/', 'rev'], cb)
})
gulp.task('default', ['rev'])