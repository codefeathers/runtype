# runtype API

`runtype` exports type predicates--functions that take a value and validate it as a type.

The following list presents the available methods and the assertion if the predicate returns true:

## Always

- **`r.any(x)`**:
	- [asserts] `x` is ignored, always returns true
	- [aliases] `r.ignore(x)`, `r.T(x)`
- **`r.F(x)`**:
	- [asserts] `x` is ignored, always returns false

## Primitives

- **`r.nil(x)`**:
	- [asserts] `x` is `null` or `undefined`
- **`r.null(x)`**:
	- [asserts] `x` is `null`
- **`r.undefined(x)`**:
	- [asserts] `x` is `undefined`
- **`r.string(x)`**:
	- [asserts] `x` is a string
- **`r.number(x)`**:
	- [asserts] `x` is a number
- **`r.bool(x)`**:
	- [asserts] `x` is a bool
- **`r.symbol(x)`**:
	- [asserts] `x` is a symbol
- **`r.object(x)`**:
	- [asserts] `x` is a object

## Runtime-related

- **`r.literal(<LITERAL>)(x)`**:
	- [where] `<LITERAL>` is a valid string, number, boolean, or object
	- [asserts] `x` is equal to `<LITERAL>`
	- [aliases] `r.equals(x)`
- **`is(<X>)(x)`**:
	- [where] `<X>` is a valid constructor
	- [asserts] `x` is an instanceof `X`
- **`type(<NAME>)(x)`**:
	- [where] `<NAME>` is a string equal to one of the possible values of `typeof`, or `"null"`
	- [asserts] `typeof x === <NAME>` (or) if `<NAME>` is `"null"`, `x` is `null`