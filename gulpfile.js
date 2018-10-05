var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');

var tsconfig = require('./tsconfig.json');
var outDir = tsconfig.compilerOptions.outDir;

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(outDir));
});

gulp.task('test', function(){
    return gulp.src('./test/test.js', {read: false})
        .pipe(mocha());
});

gulp.task('watch', ['default'], function() {
    return gulp.watch('src/*.ts', ['default']);
});

gulp.task('default', ['build', 'test'], function(){

});
