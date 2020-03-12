# runtype API

`runtype` exports type predicates—functions that take a value and validate it as a type.

The following list presents the available methods and the assertion if the predicate returns true:

# Table of contents
- [Always](#always)
	- [`T / any / ignore`](#anyx)
	- [`F`](#Fx)
- [Primitives](#primitives)
	- [`nil`](#nilx)
	- [`null`](#nullx)
	- [`undefined`](#undefinedx)
	- [`string`](#stringx)
	- [`number`](#numberx)
	- [`bool`](#boolx)
	- [`symbol`](#symbolx)
	- [`object`](#objectx)
- [Runtime-related](#runtime-related)
	- [`literal / equals`](#literalLITERALx)
	- [`is`](#isXx)
	- [`type`](#typeNAMEx)
	- [`stringTag`](#stringTagNAMEx)
- [Type combiners](#type-combiners)
	- [`not`](#notfx)
	- [`exclude`](#excludefgx)
	- [`or / sum / union`](#orfsx)
	- [`and`](#andfsx)
	- [`product / tuple`](#productfsx)
	- [`either`](#eitherfgx)
	- [`maybe / optional`](#maybefx)
	- [`refinement`](#refinementfgx)
	- [`Array`](#Arrayfx)
	- [`Struct`](#Structstructx)

## Always

#### **`any(x)`**:
- [asserts] `x` is ignored, always returns true
- [aliases] `ignore(x)`, `T(x)`

#### **`F(x)`**:
- [asserts] `x` is ignored, always returns false

## Primitives

#### **`nil(x)`**:
- [asserts] `x` is `null` or `undefined`

#### **`null(x)`**:
- [asserts] `x` is `null`

#### **`undefined(x)`**:
- [asserts] `x` is `undefined`

#### **`string(x)`**:
- [asserts] `x` is a string

#### **`number(x)`**:
- [asserts] `x` is a number

#### **`bool(x)`**:
- [asserts] `x` is a bool

#### **`symbol(x)`**:
- [asserts] `x` is a symbol

#### **`object(x)`**:
- [asserts] `x` is a object

## Runtime-related

#### **`literal(<LITERAL>)(x)`**:
- [where] `<LITERAL>` is a valid string, number, boolean, or object
- [asserts] `x` is equal to `<LITERAL>`
- [aliases] `equals(x)`

#### **`is(<X>)(x)`**:
- [where] `<X>` is a valid constructor
- [asserts] `x` is an instanceof `X`

#### **`type(<NAME>)(x)`**:
- [where] `<NAME>` is a string equal to one of the possible values of `typeof`, or `"null"`
- [asserts] `typeof x === <NAME>` (or) if `<NAME>` is `"null"`, `x` is `null`

#### **`stringTag(<NAME>)(x)`**:
- [where] `<NAME>` is a string
- [asserts] `x[Symbol.toStringTag]` is equal to `<NAME>`

## Type combiners

#### **`not(<f>)(x)`**:
- [where] `<f>` is a Predicate
- [asserts] `x` does not satisfy predicate `<f>`
- [warning] The type-guard for this method is not accurate. Will always default to `any`. Recommended to use `exclude` if possible

#### **`exclude(<f>, <g>)(x)`**:
- [where] `<f>` and `<g>` are Predicates
- [asserts] `x` is a member of the type represented by `<f>`, but NOT a member of `<g>`

#### **`or(<fs>)(x)`**:
- [where] `<fs>` is an array of Predicates
- [asserts] `x` is a member of at least one of the Predicates in `<fs>`
- [aliases] `sum(<fs>)(x)`, `union(<fs>)(x)`

#### **`and(<fs>)(x)`**:
- [where] `<fs>` is an array of Predicates
- [asserts] `x` satisfies all of the Predicates in `<fs>`

#### **`product(<fs>)(x)`**:
- [where] `<fs>` is a tuple of Predicates
- [asserts] `x` is a tuple whose members are represented by the types in `<fs>` in order
- [aliases] `tuple(<fs>)(x)`

#### **`either(<f>, <g>)(x)`**:
- [where] `<f>` and `<g>` are Predicates
- [asserts] `x` satisfies either of the types represented by `<f>` or `<g>`

#### **`maybe(<f>)(x)`**:
- [where] `<f>` is a Predicate
- [asserts] `x` either satisfies the type represented by `<f>`, or is `undefined | null`
- [aliases] `optional(<f>)(x)`

#### **`refinement(<f>, <g>)(x)`**:
- [where] `<f>` and `<g>` are Predicates
- [asserts] `x` satisfies the type represented by `<f>`, and further the type represented by `<g>`. Also: `<f> & <g>`

#### **`Array(<f>)(xs)`**:
- [where] `<f>` is a Predicate
- [asserts] `xs` is an array, where every member satisfies the type represented by `<f>`

#### **`Struct(<struct>)(x)`**:
- [where] `<struct>` is a JavaScript object, whose values are either another struct, or Predicates. `<struct>` may deeply nest as much as required.
- [asserts] `x` is an object whose values satisfy the types provided by `<struct>`'s vaues. `x` must deeply nest in the same way `<struct>` is to pass