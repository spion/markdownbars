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

Markdownbars comes with a few convenience helpers useful for generating markdown files:

{{{include 'API.tmp.md' noeval=true}}}