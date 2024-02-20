A simple javascript/typescript library for renaming variables within string.

### Why did I create this libray?
this library was created just solve a use case in another project.
So you probrably won´t need to use this.
But if not, feel free to use and modify this code.

### Use example
```replace_variables(str, separator_pattern, values)```

```ts
import { replace_variables, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/[id]/details'

const url_with_id = replace_variables(base_url, SeparatorPattern.Bracket, {
  id: 'my-id'
}) // output: https://shop.com/product/my-id/details
```

```replace_variable_on_position(str, separator_pattern, variable_position, value)```
```ts
import { replace_variable_on_position, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/my-id?color=&size='

replace_variable_on_position(base_url, SeparatorPattern.LikeUrlParameter, 1, 'red')
// output: https://shop.com/product/my-id?color=red&size=

replace_variable_on_position(base_url, SeparatorPattern.LikeUrlParameter, 2, 'large')
// output: https://shop.com/product/my-id?color=&size=large
```

### Supported patterns
Colon ```:my-varaible```

At ```@my-variable```

ParameterUrl ```?my-variable=```

Parentheses ```(my-variable)```

Braces ```{my-variable}```

Brackets ```[my-variable]```