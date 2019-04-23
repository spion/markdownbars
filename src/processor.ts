import { TOC as FileTree } from './toc';
import * as hbs from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as gm from 'gray-matter';

let wd = process.cwd(),
  rootwd: string = null!;

hbs.registerHelper('include', function(this: any, file, opts: hbs.HelperOptions) {
  let ctx = null == opts.hash['context'] ? this : opts.hash['context'];
  let target = path.resolve(wd, file);
  let oldwd = wd;
  wd = path.dirname(target);
  let res = subHandle(target, ctx);
  wd = oldwd;
  return res;
});

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

hbs.registerHelper('frontmatter', function(f: string, fieldName: string, opts: hbs.HelperOptions) {
  let filePath = path.resolve(wd, f);
  if (!fs.existsSync(filePath))
    throw new Error('Frontmatter: file ' + filePath + ' does not exist');
  let frontmatter = gm.read(filePath);
  return frontmatter.data[fieldName] || opts.hash['default'];
});

hbs.registerHelper('basename', function(filename, ext = '') {
  return path.basename(filename, ext);
});

hbs.registerHelper('file-exists', function(filename) {
  return fs.existsSync(path.resolve(wd, filename));
});

hbs.registerHelper('concat', function(...args) {
  return args.slice(0, -1).join('');
});

hbs.registerHelper('equals', function(arg1, arg2) {
  return arg1 == arg2;
});

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
