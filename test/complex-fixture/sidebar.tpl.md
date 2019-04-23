{{#glob 'packages/*' ~}}

{{~#if (file-exists (concat @file '/README.md'))}}
- [{{basename @file '.md'}}]({{concat @file '/README.md'}})
{{else}}
- {{basename @file '.md'}}
{{/if~}}

{{#if (file-exists (concat @file '/_sidebar.tpl.md'))}}
  {{left-pad 2 (include (concat @file '/_sidebar.tpl.md'))}}
{{else~}}

{{#glob (concat @file '/**/*.md')}}
{{#if (equals (basename @file '.md') 'README')}}
{{else}}
  - [{{frontmatter @file 'title' default=(basename @file '.md')}}]({{@file}})
{{/if}}
{{/glob}}

{{~/if}}

{{~/glob}}