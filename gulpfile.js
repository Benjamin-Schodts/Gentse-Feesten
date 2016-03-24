var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var git = require('gulp-git');

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
})





// Run git init 
// src is the root folder for git to initialize 
gulp.task('init', function(){
  git.init(function (err) {
    if (err) throw err;
  });
});

// Run git add with options 
gulp.task('add', function(){
    return gulp.src(['./app/*',
    	'./dist/*',
    	'./gulpfile.js',
    	'./package.json'],
    	 {base: './project'})
    .pipe(git.add({args: '-f'}));
});
 
// Run git commit 
// src are the files to commit (or ./*) 
gulp.task('commit', function(){
	return gulp.src(['./app/*',
    	'./dist/*',
    	'./gulpfile.js',
    	'./package.json'],
    	 {base: './project'})
    .pipe(git.commit('automatic commit'));
});
 
// Run git remote add 
// remote is the remote repo 
// repo is the https url of the repo 
gulp.task('addremote', function(){
  git.addRemote('origin', 'https://github.com/Benjamin-Schodts/project-one.git', function (err) {
    if (err) throw err;
  });
});
 
// Run git remote remove 
// remote is the remote repo 
gulp.task('removeremote', function(){
  git.removeRemote('origin', function (err) {
    if (err) throw err;
  });
});
 
// Run git push 
// remote is the remote repo 
// branch is the remote branch to push to 
gulp.task('push', function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});
 
// Run git pull 
// remote is the remote repo 
// branch is the remote branch to pull from 
gulp.task('pull', function(){
  git.pull('origin', 'master', {args: '--rebase'}, function (err) {
    if (err) throw err;
  });
});
 
// Run git fetch 
// Fetch refs from origin 
gulp.task('fetch', function(){
  git.fetch('origin', '', function (err) {
    if (err) throw err;
  });
});
 
// Clone a remote repo 
gulp.task('clone', function(){
  git.clone('https://github.com/Benjamin-Schodts/project-one.git', function (err) {
    if (err) throw err;
  });
});
 
// Checkout a git branch 
gulp.task('checkout', function(){
  git.checkout('branchName', function (err) {
    if (err) throw err;
  });
});
 
// Merge branches to master 
gulp.task('merge', function(){
  git.merge('branchName', function (err) {
    if (err) throw err;
  });
});
 
// Reset a commit 
gulp.task('reset', function(){
  git.reset('SHA', function (err) {
    if (err) throw err;
  });
});
 
// Git rm a file or folder 
gulp.task('rm', function(){
  return gulp.src('./gruntfile.js')
    .pipe(git.rm());
});
 
// Git clean files 
gulp.task('clean', function() {
  git.clean({ args: '-f' }, function (err) {
    if(err) throw err;
  });
});
 

