var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');

var tsconfig = require('./tsconfig.json');
var outDir = tsconfig.compilerOptions.outDir;

var sourceGlob = 'src/**/*.ts';
var testGlob = './test/**/*.js';

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    return gulp.src(sourceGlob)
        .pipe(tsProject())
        .pipe(gulp.dest(outDir));
});

gulp.task('test', function(){
    return gulp.src(testGlob, {read: false})
        .pipe(mocha());
});

gulp.task('default', gulp.series('build', 'test'));

gulp.task('watch', gulp.series('default', function() {
    return gulp.watch([sourceGlob, testGlob], gulp.series('default'));
}));
