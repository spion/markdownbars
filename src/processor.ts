import { TOC as FileTree } from './toc';
import * as hbs from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';

export function handle(fullPath: string, args: any) {
  let wd = path.dirname(fullPath);
  var tmpl = fs.readFileSync(fullPath, 'utf8');
  hbs.registerHelper('include', function(file, context) {
    var context = null == context ? args : context;
    let target = path.resolve(wd, file);
    return handle(target, context);
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
  var template = hbs.compile(tmpl.toString());
  var result = template(args);
  return result;
}
