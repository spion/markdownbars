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

## include

Usage:

    {{include 'filename.tpl.md' context=obj noeval=true}}

Includes another file. You can optionally pass a context named parameter to change the context.
The file will receive the data from the context as variables.

The noeval argument will disable evaluation of the file as a handlebars template - it will be
included verbatim.


## filetree

Usage:

    {{filetree relativePath padding}}

* relativePath - the path of the directory relative to current file
* padding - how much to pad each item in the tree except the first one

Example:

    {{filetree '.dir' 2}}

Will generate a tree list of all markdown files in 'dir'


## glob

Usage:

    {{#glob '*.md'}}
      The file is {{@file}}
    {{glob}}

Will glob each file as specified in the glob. Double star globs are also supported. For each
file found it will execute the inner block with the private variable @file containing the
relative path.

The globbing is done relative to the current file's directory.

## frontmatter

Usage

    {{frontmatter 'filename.md' 'fieldName'}}

Reads the frontmatter of the specified file and access the desired field

## basename

Usage:

    {{basename filename ext}}

Acts just like node's path.basename (will strip the file directory and specified extension)

## file-exists

Typical usage:

    {{#if (file-exists 'relative-path')}}
      show something about this file
    {{if}}

Will return true if the file exists. Typically only useful as a sub-expression.

## concat

Typical Usage

    {{#if (file-exists (concat @file 'OtherSegment'))}}
      some output
    {{if}}

Concatenate multiple strings into one. Normally this is not needed in handlebars, however
in sub-expressions it may be necessary to pass a different argument

## equals

Just a regular loose equality check, useful in sub-expressions

## not

Inverts a boolean, e.g.

    {{#if (not (file-exists 'file'))}}
      Show content if file does not exist
    {{if}}


## left-pad

Example Usage:

    {{left-pad 2 (include 'othertemplate.md')}}

Useful to pad content produced by other helpers by the appropriate amount e.g. for lists.


