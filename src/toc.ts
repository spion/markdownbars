import * as fs from 'fs';
import * as path from 'path'

type Entry = {
  name: string;
  link: string;
  children?: Entry[];
};

let ignores = /node_modules|^\.|_sidebar|_docsify/;
let isDoc = /.md$/;

export class TOC {

private niceName(name: string) {
  let splitName = name.split('-');
  if (Number.isNaN(Number(splitName[0]))) return splitName.join(' ');
  return splitName.slice(1).join(' ');
}
private buildTree(dirPath: string, name = '', dirLink = ''): Entry {
  let children: Entry[] = [];
  for (let fileName of fs.readdirSync(dirPath)) {
    if (ignores.test(fileName)) continue;

    let fileLink = dirLink + '/' + fileName;
    let filePath = path.join(dirPath, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      let sub = this.buildTree(filePath, fileName, fileLink);
      if (sub.children != null && sub.children.length > 0)
        children.push(sub);
    } else if (isDoc.test(fileName)) {
      children.push({ name: fileName, link: fileLink });
    }
  }

  return { name, children, link: dirLink };
}
private renderToMd(tree: Entry, linkDir = false): string {
  if (!tree.children) {
    return `- [${this.niceName(path.basename(tree.name, '.md'))}](${tree.link.replace(/ /g, '%20')})`;
  } else {
    let fileNames = new Set(tree.children.filter(c => !c.children).map(c => c.name));
    let dirNames = new Set(tree.children.filter(c => c.children).map(c => c.name + '.md'));

    let content = tree.children
      .filter(c => (!fileNames.has(c.name) || !dirNames.has(c.name)) && c.name != 'README.md')
      .map(c => this.renderToMd(c, dirNames.has(c.name + '.md') && fileNames.has(c.name + '.md')))
      .join('\n')
      .split('\n')
      .map(item => '  ' + item)
      .join('\n');
    let prefix = '';
    if (tree.name) {
      if (linkDir || fileNames.has('README.md')) {
        let linkPath = tree.link.replace(/ /g,'%20');
        if (fileNames.has('README.md')) linkPath += '/README.md';
        prefix = `- [${this.niceName(path.basename(tree.name, '.md'))}](${linkPath})\n`;
      }
      else prefix = `- ${this.niceName(tree.name)}\n`;
    }

    return prefix + content;
  }
}

index(path: string, leftPad: number) {
  let padding = new Array(leftPad + 1).join(' ')
  let root = this.buildTree(path);
  return this.renderToMd(root).split("\n").map(i => i.substr(2)).join('\n' + padding)
}

}


