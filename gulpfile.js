const gulp = require('gulp');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');

const tsconfig = require('./tsconfig.json');
const outDir = tsconfig.compilerOptions.outdir;

const tsProject = ts.createProject('tsconfig.json');

function build(){
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(outDir));
}

function test(){
    return gulp.src('./test/test.js', {read: false})
        .pipe(mocha())
}

function watch(){
    return gulp.watch('src/*.ts', ['default']);
}

gulp.task('build', function() {
    build();
});

gulp.task('test', function(){
    test();
});

gulp.task('watch', ['default'], function() {
    watch();
});

gulp.task('default', ['build'], function(){
    test();
})
