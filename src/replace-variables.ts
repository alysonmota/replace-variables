import { OnlyBegin, SeparatorPattern } from './constants'

type BreakBeginChars =
	| '/'
	| '['
	| ']'
	| '{'
	| '}'
	| '('
	| ')'
	| '-'
	| '&'
	| '/'
	| '?'
type OnlyBeginChars = (typeof OnlyBegin)[keyof typeof OnlyBegin]
type Separators = (typeof SeparatorPattern)[keyof typeof SeparatorPattern]

type ExtractVariableWithBeginAndEnd<
	InputPart extends string,
	Begin extends string,
	End extends string,
> = InputPart extends `${Begin}${infer _}${End}` ? never : never

type VariablesWithTwoSeparators<
	Input extends string,
	VariablesSeparator extends Separators,
> = VariablesSeparator extends `${infer O}${infer C}`
	? Input extends `${infer A}${O}${infer B}${C}${infer X}`
		? B extends ''
			? never
			:
					| B
					| VariablesWithTwoSeparators<A, VariablesSeparator>
					| VariablesWithTwoSeparators<X, VariablesSeparator>
		: ExtractVariableWithBeginAndEnd<Input, O, C>
	: never

type ExtractVariableWithOnlyBegin<
	InputPart extends string,
	Begin extends OnlyBeginChars,
> = InputPart extends `${infer X}${Begin}`
	? X
	: InputPart extends `${infer X}${BreakBeginChars}${infer _}`
	  ? X
	  : InputPart extends `${infer B}${BreakBeginChars}`
		  ? B
		  : never

type VariablesWithOneSeparator<
	Input extends string,
	Begin extends OnlyBeginChars,
> = Input extends `${Begin}${infer X}${BreakBeginChars}${infer A}`
	? ExtractVariableWithOnlyBegin<X, Begin> | VariablesWithOneSeparator<A, Begin>
	: Input extends `${BreakBeginChars}${Begin}${infer Y}`
	  ? Y
	  : Input extends `${infer _}${Begin}${infer E}${BreakBeginChars}${infer F}`
		  ? E extends ''
				? VariablesWithOneSeparator<F, Begin>
				: E extends `${BreakBeginChars}${infer _}`
				  ? never
				  : E | VariablesWithOneSeparator<F, Begin>
		  : Input extends `${infer _}${Begin}${infer T}`
			  ? T
			  : never

type GetVariablesLikeUrlParameter<Input extends string> =
	Input extends `${infer X}=&${infer R}`
		? X | GetVariablesLikeUrlParameter<R>
		: Input extends `${infer Y}=`
		  ? Y
		  : never

type Variables<
	Input extends string,
	VariablesSeparator extends Separators,
> = VariablesSeparator extends typeof SeparatorPattern.LikeUrlParameter
	? {
			[v in GetVariablesLikeUrlParameter<
				Input extends `${infer _}?${infer R}` ? R : never
			>]: string
	  }
	: {
			[v in VariablesSeparator extends OnlyBeginChars
				? VariablesWithOneSeparator<Input, VariablesSeparator>
				: VariablesWithTwoSeparators<Input, VariablesSeparator>]: string
	  }

function isValidSeparator(separator: Separators): boolean {
	const patterns_values = Object.values(SeparatorPattern)
	return patterns_values.includes(separator)
}

function escapeString(str: string): string {
	return str.replace(/[\\\/\[\]\(\)\?&=]/g, '\\$&')
}

function replaceVariables<
	InputWithoutValues extends string,
	VariablesSeparator extends Separators,
>(
	str: InputWithoutValues,
	variables_separator: VariablesSeparator,
	variables_values: Partial<Variables<InputWithoutValues, VariablesSeparator>>,
): string {
	if (!isValidSeparator(variables_separator)) {
		throw new Error(`"${variables_separator}" is not valid separator`)
	}

	const [begin_char, end_char] = variables_separator.split(String())

	const keys_and_variables = <Array<[keyof typeof variables_values, string]>>(
		Object.entries(variables_values)
	)

	for (const [variable_name, variable_value] of keys_and_variables) {
		if (!variable_name || !variable_value) continue

		const replace_regex = new RegExp(
			escapeString(`${begin_char}${<string>variable_name}${end_char}`),
		)

		if (!replace_regex.test(str)) continue

		str = <InputWithoutValues>str.replace(replace_regex, variable_value)
	}

	return str
}

function replaceVariablesWithUsedValues<
	InputWithoutValues extends string,
	VariablesSeparator extends Separators,
>(
	str: InputWithoutValues,
	variables_separator: VariablesSeparator,
	variables_values: Partial<Variables<InputWithoutValues, VariablesSeparator>>,
): [str_with_values: string, used_variables: Array<string>] {
	const used_values = new Array<string>()

	if (!isValidSeparator(variables_separator)) {
		throw new Error(`"${variables_separator}" is not valid separator`)
	}

	const [begin_char, end_char] = variables_separator.split(String())

	const keys_and_variables = <Array<[keyof typeof variables_values, string]>>(
		Object.entries(variables_values)
	)

	for (const [variable_name, variable_value] of keys_and_variables) {
		if (!variable_name || !variable_value) continue

		const replace_regex = new RegExp(
			escapeString(`${begin_char}${<string>variable_name}${end_char}`),
		)

		if (!replace_regex.test(str)) continue

		used_values.push(variable_value)
		str = <InputWithoutValues>str.replace(replace_regex, variable_value)
	}

	return [str, used_values]
}

function replaceVariableOnPosition(
	str: string,
	separator: Separators,
	target_variable_position: number,
	variable_value: string,
) {
	if (!separator || !isValidSeparator(separator)) return str

	const [begin_char_separator, end_char_separator] = separator.split(String())
	if (!begin_char_separator || !end_char_separator) return str

	let start_variable_index = -1
	let end_variable_index = -1
	let str_index = 0
	let variables_count = 0

	outside_loop: while (true) {
		if (!str[str_index]) break

		if (str[str_index] === begin_char_separator) {
			start_variable_index = str_index
			let position_after_begin = 1 + str_index

			while (true) {
				if (
					!str[position_after_begin] ||
					str[position_after_begin] === begin_char_separator
				)
					break
				if (str[position_after_begin] === end_char_separator) {
					end_variable_index = 1 + position_after_begin
					variables_count++
					if (
						variables_count >= target_variable_position &&
						!(position_after_begin - start_variable_index === 1)
					) {
						break outside_loop
					}
				}
				position_after_begin++
			}
		}
		str_index++
	}

	if (start_variable_index <= -1 || end_variable_index <= -1) {
		return str
	}

	return `${str.substring(
		0,
		start_variable_index,
	)}${variable_value}${str.substring(end_variable_index)}`
}

export {
	replaceVariableOnPosition,
	replaceVariables,
	replaceVariablesWithUsedValues,
}
export { SeparatorPattern }
export default replaceVariablesWithUsedValues
