const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsconfig = require('./tsconfig.json')
const outDir = tsconfig.compilerOptions.outdir;

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(outDir));
});

gulp.task('watch', ['build'], function() {
    gulp.watch('src/*.ts', ['build']);
});

gulp.task('default', ['build'])
