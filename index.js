'use strict'

const es = require('event-stream')
const minilr = require('mini-lr')
const path = require('path')
const relative = path.relative
const debug = require('debug')('gulp:refresh')
const gutil = require('gulp-util')
const magenta = require('chalk').magenta

/**
 * Global Options
 * port             Server Port
 * host             Server Host
 * basePath         base directory the path will be resolved to
 * start            start the server automatically
 * quiet            Enable/Disable debug logging
 * reloadPage       The page to reload upon issuing a full page reload
 */
var options = {
  quiet: false,
  reloadPage: 'index.html'
}

/**
 * Create a stream for telling
 * the livereload server about changes
 *
 * If opts isn't present then return
 *
 * @param {object|number} [opts]
 * @param [opts.port]     livereload server port
 * @param [opts.host]     livereload server host
 * @param [opts.basePath] base directory the path will be resolved to
 * @param [opts.start]    automatically start the server
 * @param [opts.quiet=false]
 */

module.exports = exports = function (opts) {
  options = Object.assign(options, opts)

  var glr = es.map(function (file, done) {
    var filePath = file.path
    exports.changed(filePath)
    done(null, file)
  })

  if (options.start) exports.listen(options)

  return glr
}

// Note: This is a good way to directly set the settings once throughout
// the program, a reference to the global options
exports.options = options

// A way to grab or change the underlying server instance
exports.server = undefined

/**
 * Express middleware
 *
 * A direct reference to the underlying servers middleware reference
 */

exports.middleware = minilr.middleware

/**
 * Start the livereload server
 *
 * If opts isn't present the global is used, if opts is a number its used as
 * the port, otherwise as the config object
 *
 * @param {object|number} [opts]
 * @param [opts.port]     livereload server port
 * @param [opts.host]     livereload server host
 * @param [opts.basePath] base directory the path will be resolved to
 * @param [opts.start]    automatically start the server
 * @param [opts.quiet=false]
 * @param {function} [cb] callback
 */

exports.listen = function (opts, cb) {
  if (exports.server) return

  if (typeof opts === 'number') {
    opts = { port: opts }
  } else if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  options = Object.assign(options, opts)
  exports.server = new minilr.Server(options)
  exports.server.listen(options.port, options.host, function () {
    debug('now listening on port %d', options.port)
    if (typeof cb === 'function') cb.apply(exports.server, arguments)
  })
}

/**
 * Instruct the server that a file has changed
 * and should be re-downloaded.
 *
 * The server must be running or this method will exit on error.
 * If an object is given the "path" property is used, otherwise
 * its a path string
 *
 * @param  {string|object} filePath
 */

exports.changed = function (filePath) {
  if (!exports.server) {
    debug('no server listening, nothing notified.')
    return
  }

  if (typeof filePath === 'object') {
    filePath = filePath.path
  }

  if (options.basePath) {
    filePath = '/' + relative(options.basePath, filePath)
  }

  exports.server.changed({ body: { files: [ filePath ] } })

  if (!options.quiet) {
    var filename = magenta(path.basename(filePath))
    gutil.log('Reloaded ' + filename)
  }
}

/**
 * Invoke a full page reload, including all assets
 *
 * Path to the page in use must be given, If filePath isn't provided then the filePath will be used
 * from the global config which is by default "index.html". The basePath will automatically be
 * applied to this
 *
 * * @param  {string} [filePath]
 */
exports.reload = function (filePath) {
  exports.changed(filePath || options.reloadPage)
}
