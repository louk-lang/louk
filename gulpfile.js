const gulp = require('gulp');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');

const tsconfig = require('./tsconfig.json');
const outDir = tsconfig.compilerOptions.outdir;

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(outDir));
});

gulp.task('watch', ['default'], function() {
    return gulp.watch('src/*.ts', ['default']);
});

gulp.task('test', ['build'], function(){
    return gulp.src('./test/test.js', {read: false})
		.pipe(mocha())
});

gulp.task('default', ['build','test'])
