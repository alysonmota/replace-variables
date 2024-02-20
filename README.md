A simple javascript/typescript library for renaming variables within string.

### Why did I create this libray?
this library was created just solve a use case in another project.
So you probrably won´t need to use this.
But if not, feel free to use and modify this code.

### Use example
```replaceVariables(str, separator_pattern, values)```

```ts
import { replace_variables, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/[id]/details'

const url_with_id = replace_variables(base_url, SeparatorPattern.Bracket, {
  id: 'my-id'
}) // output: https://shop.com/product/my-id/details
```

```replaceVariablesWithUsedValues(str, separator_pattern, variable_position, value)```

same replaceVariables but returns values that have been used 
```ts
import { replaceVariablesWithUsedValues, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/:id/details'

replaceVariablesWithUsedValues(base_url, SeparatorPattern.Colon, {
  id: 'my-id'
})
// output: [str: https://shop.com/product/my-id?color=red&size=, arr: [my-id]]
```

```replaceVariableOnPosition(str, separator_pattern, variable_position, value)```
```ts
import { replaceVariableOnPosition, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/my-id?color=&size='

replaceVariableOnPosition(base_url, SeparatorPattern.LikeUrlParameter, 1, 'red')
// output: https://shop.com/product/my-id?color=red&size=

replaceVariableOnPosition(base_url, SeparatorPattern.LikeUrlParameter, 2, 'large')
// output: https://shop.com/product/my-id?color=&size=large
```

### Supported patterns
Colon ```:my-varaible```

At ```@my-variable```

LikeUrlParameter ```?my-variable=```

Parentheses ```(my-variable)```

Braces ```{my-variable}```

Brackets ```[my-variable]```