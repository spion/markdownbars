#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  args = require('optimist').argv,
  encode = require('entity-convert'),
  hbs = require('handlebars'),
  options = {
    'strict': (typeof args.strict !== 'undefined' && args.strict),
    'noEscape': true
  },
  keepMissingExpressions = (typeof args['keep-missing'] !== 'undefined' && args['keep-missing']);


if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

if (args._.length) {
  try {
    var configFile = args._[0].toString();

    if (configFile.match(/js$/)) {
      args = require(path.join(process.cwd(), configFile));
    } else {
      var beforeEscape = fs.readFileSync(configFile).toString();
      // var afterEscape = encode.html(beforeEscape);
      // args = JSON.parse(afterEscape);
      args = JSON.parse(beforeEscape);
    }
  } catch (e) { }
} else
  for (var key in args) {
    try {
      args[key] = JSON.parse(args[key]);
    } catch (e) { }
  }

function readStream(s, done) {
  var bufs = [];
  s.on('data', function (d) {
    bufs.push(d);
  });
  s.on('end', function () {
    done(null, Buffer.concat(bufs));
  });
  s.resume();
}

readStream(process.stdin, function (err, tmpl) {
  function handle(tmpl, args) {
    hbs.registerHelper('include', function (file, context, opt) {
      if (typeof context === 'string') {
        context = Object.assign({}, args, JSON.parse(context));
      } else if (typeof context === 'object') {
        context = Object.assign({}, args, context);
      } else {
        context = args;
      }
      var f = fs.readFileSync(file);
      return handle(f, context);
    });
    if (keepMissingExpressions) {
      hbs.registerHelper('helperMissing', function (arg) {
        return '{{' + arg.name + '}}';
      });
    }
    var template = hbs.compile(tmpl.toString(), options);
    var result = template(args);
    return result;
  }
  process.stdout.write(handle(tmpl, args));
});
