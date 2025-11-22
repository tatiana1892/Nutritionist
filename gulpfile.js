const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const fileinclude = require("gulp-file-include");
const replace = require("gulp-replace");

// --------------------------------------------------
// PATHS
// --------------------------------------------------
const paths = {
  html: "src/html/pages/**/*.html",
  htmlPartials: "src/html/partials/**/*.html",
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
  images: "src/img/**/*",
  fonts: "src/fonts/**/*",
  dist: "docs/" // збірка одразу у docs для GitHub Pages
};

// --------------------------------------------------
// CLEAN
// --------------------------------------------------
gulp.task("clean", () =>
  gulp.src(paths.dist, { allowEmpty: true }).pipe(clean())
);

// --------------------------------------------------
// HTML (includes + fix paths + base)
// --------------------------------------------------
gulp.task("html", () => {
  return gulp
    .src(paths.html)
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    // універсальна заміна для всіх ../
    .pipe(replace(/\.\.\/css\//g, "css/"))
    .pipe(replace(/\.\.\/js\//g, "js/"))
    .pipe(replace(/\.\.\/img\//g, "img/"))
    .pipe(replace(/\.\.\/fonts\//g, "fonts/"))
    // додаємо <base> для GitHub Pages
    .pipe(replace("<head>", '<head>\n  <base href="/Nutritionist/">'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

// --------------------------------------------------
// SCSS → CSS
// --------------------------------------------------
gulp.task("styles", () => {
  return gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat("style.min.css"))
    .pipe(gulp.dest(paths.dist + "css"))
    .pipe(browserSync.stream());
});

// --------------------------------------------------
// JS
// --------------------------------------------------
gulp.task("scripts", () => {
  return gulp
    .src(paths.js)
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + "js"))
    .pipe(browserSync.stream());
});

// --------------------------------------------------
// IMAGES
// --------------------------------------------------
gulp.task("images", () => {
  return gulp
    .src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + "img"))
    .pipe(browserSync.stream());
});

// --------------------------------------------------
// FONTS
// --------------------------------------------------
gulp.task("fonts", () => {
  return gulp
    .src(paths.fonts)
    .pipe(gulp.dest(paths.dist + "fonts"))
    .pipe(browserSync.stream());
});

// --------------------------------------------------
// SERVE (BrowserSync + watchers)
// --------------------------------------------------
gulp.task("serve", () => {
  browserSync.init({
    server: { baseDir: paths.dist },
    notify: false,
    open: true,
  });

  gulp.watch("src/html/**/*.html", gulp.series("html"));
  gulp.watch(paths.scss, gulp.series("styles"));
  gulp.watch(paths.js, gulp.series("scripts"));
  gulp.watch(paths.images, gulp.series("images"));
  gulp.watch(paths.fonts, gulp.series("fonts"));
});

// --------------------------------------------------
// BUILD
// --------------------------------------------------
gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("html", "styles", "scripts", "images", "fonts"))
);

// --------------------------------------------------
// DEFAULT
// --------------------------------------------------
gulp.task("default", gulp.series("build", "serve"));
