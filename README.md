# markdownbars

Harndlebars on the cmdline with markdown helpers.

```
Usage: markdownbars -i input.hbs.md [-d data] [-o output.md]

Options:
  --help, -h    Generate help                         [boolean] [default: false]
  --version     Show version number                                    [boolean]
  --input, -i   Input file                                   [string] [required]
  --output, -o  Output file                                             [string]
  --data, -d    Additional JSON data to pass into the template
                                                        [string] [default: "{}"]
```

# install

    npm install -g markdownbars

# helpers

## include

markdownbars comes with a built-in helper `#include`

    {{include 'api.md'}}

You can also pass context (optional)

    {{include 'render.md.hbs' item}}

## filetree

Usage:

    {{filetree relativePath padding}}

* relativePath - the path of the directory relative to current file
* padding - how much to pad each item in the tree except the first one

Example:

    {{filetree './dir' 2}}

Will generate a tree list of all markdown files in 'dir'

# license

MIT
