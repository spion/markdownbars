Sample glob:
{{#glob 'a/**/*.md'}}
  Path: {{{@file}}}
{{/glob}}

{{#glob '*.md' wd='a'}}
  Path: a/{{{@file}}}
{{/glob}}

{{#glob 'a/**/*.md'}}
  Path: {{frontmatter @file 'title' default=(basename @file '.md')}}
{{/glob}}
