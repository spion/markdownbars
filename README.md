# handlebars-cmd

Invoke handlebars from the commandline. 

Example:

    echo "Hello {{name}}" | handlebars --name Test

Output:

    Hello Test

You may also pass JSON as an argument and use the complete object.

# include helper

handlebars-cmd comes with a built-in helper `#include`
    
    {{{include 'api.md'}}}

You can also pass context (optional)
    
    {{{include 'render.md.hbs' item}}}

# license

MIT
