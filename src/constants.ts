const OnlyBegin = <const>{
	LikeUrlParameter: '=',
	Colon: ':',
	At: '@',
}

const BeginAndEnd = <const>{
	Bracket: '[]',
	Parentheses: '()',
	Braces: '{}',
}

const SeparatorPattern = Object.freeze({
	...OnlyBegin,
	...BeginAndEnd,
})

export { OnlyBegin, BeginAndEnd, SeparatorPattern }
