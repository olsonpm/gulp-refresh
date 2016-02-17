# gulp-refresh

[![Build Status](https://travis-ci.org/leo/gulp-refresh.svg?branch=master)](https://travis-ci.org/leo/gulp-refresh)

A lightweight [gulp](https://github.com/gulpjs/gulp) plugin for livereload to be used with the [livereload chrome extension](http://livereload.com/extensions/) or a [livereload middleware](https://github.com/intesso/connect-livereload).

This repo is based on a fork of Cyrus David's [gulp-livereload](https://github.com/vohof/gulp-livereload). Since he hasn't been active since a long time, it seemed like a good idea to fork it. I'm also using it in a lot of my upcoming projects and I didn't want it to just die. Please keep in mind that `v1.0.0` of this plugin is equal to `v3.8.1` (the latest version) of the original plugin. So no extra effort. Just replace `gulp-livereload` with the latest version of `gulp-refresh` in your dependencies.

- [Installation](#install)
- [Upgrade Notice](#3x-upgrade-notice)
- [Usage](#usage)
- [API](#api--variables)
 - [Options](#options-optional)
 - [livereload](#livereloadoptions)
 - [livereload.listen](#livereloadlistenoptions)
 - [livereload.changed](#livereloadchangedpath)
 - [livereload.reload](#livereloadreloadfile)
 - [livereload.middleware](#livereloadmiddleware)
 - [livereload.server](#livereloadserver)
- [Debugging](#debugging)
- [License](#license)

Install
---

```
npm install --save-dev gulp-refresh
```

3.x Upgrade Notice
---

`gulp-refresh` will not automatically listen for changes. You now have to manually call `livereload.listen` unless you set the option `start`:

```js
livereload({ start: true })
```

Usage
---

```javascript
var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-refresh');

gulp.task('less', function() {
  gulp.src('less/*.less')
    .pipe(less())
    .pipe(gulp.dest('css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('less/*.less', ['less']);
});
```

**See [examples](examples)**.

API & Variables
---

### Options (Optional)

These options can either be set through `livereload.listen(options)` or `livereload(options)`.

```
port                     Server port
host                     Server host
basePath                 Path to prepend all given paths
start                    Automatically start
quiet        false       Disable console logging
reloadPage   index.html  Path to the browser's current page for a full page reload
```

### livereload([options])

Creates a stream which notifies the livereload server on what changed.

### livereload.listen([options])

Starts a livereload server. It takes an optional options parameter that is the same as the one noted above. Also you dont need to worry with multiple instances as this function will end immediately if the server is already runing.

### livereload.changed(path)

Alternatively, you can call this function to send changes to the livereload server. You should provide either a simple string or an object, if an object is given it expects the object to have a `path` property.

> NOTE: Calling this function without providing a `path` will do nothing.

### livereload.reload([file])

You can also tell the browser to refresh the entire page. This assumes the page is called `index.html`, you can change it by providing an **optional** `file` path or change it globally with the options `reloadPage`.

###  livereload.middleware

You can also directly access the middleware of the underlying server instance (mini-lr.middleware) for hookup through express, connect, or some other middleware app

### livereload.server

gulp-livereload also reveals the underlying server instance for direct access if needed. The instance is a "mini-lr" instance that this wraps around. If the server is not running then this will be `undefined`.

Debugging
---

Set the `DEBUG` environment variables to `*` to see what's going on


```
$ DEBUG=* gulp <task>
```
