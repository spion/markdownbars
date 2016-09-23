#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    args = require('optimist').argv,
    hbs = require('handlebars'),
    options = {
        'strict': (typeof args.strict !== 'undefined' && args.strict)
    },
    keepMissingExpressions = (typeof args['keep-missing'] !== 'undefined' && args['keep-missing']);

if (args._.length) {
    try {
        var configFile = args._[0].toString();

        if (configFile.match(/js$/)) {
            args = require(path.join(process.cwd(), configFile));
        } else {
            args = JSON.parse(fs.readFileSync(configFile).toString());
        }
    } catch (e) {}
} else
    for (var key in args) {
        try {
            args[key] = JSON.parse(args[key]);
        } catch (e) {}
    }

function readStream(s, done) {
    var bufs = [];
    s.on('data', function(d) {
        bufs.push(d);
    });
    s.on('end', function() {
        done(null, Buffer.concat(bufs));
    });
    s.resume();
}

readStream(process.stdin, function(err, tmpl) {
    function handle(tmpl, args) {
        hbs.registerHelper('include', function(file, context, opt) {
            var context = null == context ? args : context;
            var f = fs.readFileSync(file);
            return handle(f, context);
        });
        if ( keepMissingExpressions ) {
            hbs.registerHelper('helperMissing', function(arg) {
                return '{{' + arg.name + '}}';
            });
        }
        var template = hbs.compile(tmpl.toString(), options);
        var result = template(args);
        return result;
    }
    process.stdout.write(handle(tmpl, args));
});
