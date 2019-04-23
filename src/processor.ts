import { TOC as FileTree } from './toc';
import * as hbs from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as gm from 'gray-matter';

let wd = process.cwd(),
  rootwd: string = null!;

/**
 * ## include
 *
 * Usage:
 *
 *     {{include 'filename.tpl.md' context=obj noeval=true}}
 *
 * Includes another file. You can optionally pass a context named parameter to change the context.
 * The file will receive the data from the context as variables.
 *
 * The noeval argument will disable evaluation of the file as a handlebars template - it will be
 * included verbatim.
 *
 */
hbs.registerHelper('include', function(this: any, file, opts: hbs.HelperOptions) {
  let ctx = null == opts.hash['context'] ? this : opts.hash['context'];
  let noeval = null != opts.hash['noeval'];
  let target = path.resolve(wd, file);
  let oldwd = wd;
  wd = path.dirname(target);
  let res = noeval ? fs.readFileSync(target) : subHandle(target, ctx);
  wd = oldwd;
  return res;
});

/**
 * ## filetree
 *
 * Usage:
 *
 *     {{filetree relativePath padding}}
 *
 * * relativePath - the path of the directory relative to current file
 * * padding - how much to pad each item in the tree except the first one
 *
 * Example:
 *
 *     {{filetree './dir' 2}}
 *
 * Will generate a tree list of all markdown files in 'dir'
 *
 */
hbs.registerHelper('filetree', function(dir: string, pad: number, base: string) {
  if (typeof pad !== 'number') pad = 0;
  let p = path.resolve(wd, dir);
  let relDir = path.relative(wd, p);
  if (typeof base !== 'string') {
    if (p !== dir && relDir.length > 0) base = '/' + relDir;
    else base = '';
  }
  let toc = new FileTree();
  return toc.index(p, pad, base);
});

/**
 * ## glob
 *
 * Usage:
 *
 *     {{#glob '*.md'}}
 *       The file is {{@file}}
 *     {{/glob}}
 *
 * Will glob each file as specified in the glob. Double star globs are also supported. For each
 * file found it will execute the inner block with the private variable @file containing the
 * relative path.
 *
 * The globbing is done relative to the current file's directory.
 */
hbs.registerHelper('glob', function(this: unknown, globString: string, opts: hbs.HelperOptions) {
  let localWD = opts.hash['wd'] ? path.resolve(wd, opts.hash['wd']) : wd;
  let items = glob.sync(globString, {
    cwd: localWD,
  });
  return items.map(item => opts.fn(this, { data: { file: item } })).join('');
});

hbs.registerHelper('cwd', function(this: unknown, dir: string, opts: hbs.HelperOptions) {
  let oldwd = wd;
  wd = path.resolve(wd, dir);
  let res = opts.fn(this);
  wd = oldwd;
  return res;
});

/**
 * ## frontmatter
 *
 * Usage
 *
 *     {{frontmatter 'filename.md' 'fieldName'}}
 *
 * Reads the frontmatter of the specified file and access the desired field
 */
hbs.registerHelper('frontmatter', function(f: string, fieldName: string, opts: hbs.HelperOptions) {
  let filePath = path.resolve(wd, f);
  if (!fs.existsSync(filePath))
    throw new Error('Frontmatter: file ' + filePath + ' does not exist');
  let frontmatter = gm.read(filePath);
  return frontmatter.data[fieldName] || opts.hash['default'];
});

/**
 * ## basename
 *
 * Usage:
 *
 *     {{basename filename ext}}
 *
 * Acts just like node's path.basename (will strip the file directory and specified extension)
 */
hbs.registerHelper('basename', function(filename, ext = '') {
  return path.basename(filename, ext);
});

/**
 * ## file-exists
 *
 * Typical usage:
 *
 *     {{#if (file-exists 'relative-path')}}
 *       show something about this file
 *     {{/if}}
 *
 * Will return true if the file exists. Typically only useful as a sub-expression.
 */
hbs.registerHelper('file-exists', function(filename) {
  return fs.existsSync(path.resolve(wd, filename));
});

/**
 * ## concat
 *
 * Typical Usage
 *
 *     {{#if (file-exists (concat @file '/OtherSegment'))}}
 *       some output
 *     {{/if}}
 *
 * Concatenate multiple strings into one. Normally this is not needed in handlebars, however
 * in sub-expressions it may be necessary to pass a different argument
 */
hbs.registerHelper('concat', function(...args) {
  return args.slice(0, -1).join('');
});

/**
 * ## equals
 *
 * Just a regular loose equality check, useful in sub-expressions
 */
hbs.registerHelper('equals', function(arg1, arg2) {
  return arg1 == arg2;
});

/**
 * ## not
 *
 * Inverts a boolean, e.g.
 *
 *     {{#if (not (file-exists 'file'))}}
 *       Show content if file does not exist
 *     {{/if}}
 *
 */
hbs.registerHelper('not', function(arg1, arg2) {
  return !arg1;
});

/**
 * ## left-pad
 *
 * Example Usage:
 *
 *     {{left-pad 2 (include 'othertemplate.md')}}
 *
 * Useful to pad content produced by other helpers by the appropriate amount e.g. for lists.
 *
 */
hbs.registerHelper('left-pad', function(amount: number, content: string) {
  let spaces = new Array(amount + 1).join(' ');
  return content.split('\n').join('\n' + spaces);
});

hbs.registerHelper('cwd', function() {
  console.log(rootwd, wd);
  return path.relative(rootwd, wd);
});

function subHandle(fullPath: string, args: any) {
  wd = path.dirname(fullPath);
  let tmpl = fs.readFileSync(fullPath, 'utf8');

  var template = hbs.compile(tmpl.toString());
  var result = template(args);
  return result;
}

export function handle(fullPath: string, args: any) {
  rootwd = path.dirname(fullPath);
  return subHandle(fullPath, args);
}
