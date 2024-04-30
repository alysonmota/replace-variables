A simple javascript/typescript library for renaming variables within string.

<br />

### Why did I create this libray?
this library was created just solve a use case in another project.
So you probrably won´t need to use this.
But if not, feel free to use and modify this code.

<br />

### Use example
replaceVariables(str: string, separator_pattern: string, values: Record<string, string>): string

```ts
import { replaceVariables, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/[id]/details'

const url_with_id = replaceVariables(base_url, SeparatorPattern.Bracket, {
  id: 'my-id'
}) // => https://shop.com/product/my-id/details
```

<br />

replaceVariablesWithUsedValues(str: string, separator_pattern: string, variable_position, Record<string, string>): [string, Array\<string\>]

same replaceVariables but returns values that have been used 
```ts
import { replaceVariablesWithUsedValues, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/:id/details'

replaceVariablesWithUsedValues(base_url, SeparatorPattern.Colon, {
  id: 'my-id'
}) // => [https://shop.com/product/my-id?color=red&size=, [my-id]]
```

<br />

replaceVariableOnPosition(str: string, separator_pattern: string, variable_position: number, value: string): string

```ts
import { replaceVariableOnPosition, SeparatorPattern } from 'replace-variables'

const base_url = 'https://shop.com/product/my-id?color=&size='

replaceVariableOnPosition(base_url, SeparatorPattern.LikeUrlParameter, 1, 'red') // => https://shop.com/product/my-id?color=red&size=

replaceVariableOnPosition(base_url, SeparatorPattern.LikeUrlParameter, 2, 'large') // => https://shop.com/product/my-id?color=&size=large
```

### Supported patterns
Colon ```:my-varaible```

At ```@my-variable```

LikeUrlParameter ```?my-variable=```

Parentheses ```(my-variable)```

Braces ```{my-variable}```

Brackets ```[my-variable]```