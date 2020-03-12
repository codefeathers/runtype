# runtype

Runtime type assertions that return.

## Why

`runtype` was created to serve as the runtime type assertion library for [`@codefeathers/poly`](https://npmjs.com/package/@codefeathers/poly). And as such, it makes a best effort to always return boolean, rather than silently pass and loudly throw. As a bonus, every<sup>[[1]](#typescript-limitations)</sup> predicate is also a TypeScript type-guard.

Any throwing behaviour definitely qualifies as a bug. The absense of a type-guard, or the misbehaviour of one also qualifies as a serious bug. Make issues or PRs regarding them.

## Data-last

`runtype` follows the data-last style. Higher order predicates always return a function that takes the input element. This makes it easier to create composed functions ahead of time while not waiting for data. Example:

```ts
import r from "@codefeathers/runtype";

// Array is a Higher Order Predicate (it takes a predicate as input):
const numbers = r.Array(r.number);

// which is infinitely cleaner rather than:
const numbers = x => r.Array(x, x => r.number(x));
```

## Predicate specification

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

You can write your own custom predicates.

To be compatible with `runtype`, you MUST follow the one of the following signatures:

```ts
// Simple Predicate:
type SimplePredicate = (x: any): x is Type = {
	/* runtime validation for x that returns true/false */
};

// Higher Order Predicate:
type HOPredicate = (ctx: any) => (x: any): x is Type = {
	/* runtime validation for x that returns true/false */
};
```

Higher Order Predicates MAY accept one or more Simple Predicates and MUST return a Simple Predicate. A Simple Predicate MUST always guard a type.

## TypeScript limitations

This library has taken care to meticulously type anything at all possible, but TypeScript (as of writing, v3.8.x) has limitations. We address these with adhoc solutions and TypeScript's escape hatches. While contributing to this repository, you should only resort to this as the last stand, if nothing else works. If a type is not guardable, also consider whether it is essential to `runtype`.

**Known limitations:**

```ts
const notString = r.not(r.string);
// Must have been NOT string, but the absense of negated types leaves us at `any`

const p = r.product([r.string, r.number, r.bool]);
// This correctly guards the tuple [string, number, boolean]
// However, because TypeScript has no support for variadic kinds,
// We've limited the number of members for the product type as 1 to 15
```

In the past, with some effort and sleepless nights, we've overcome seemingly serious limitations like the variadic `r.or` and `r.and` types. In the future, it may be possible to type both `r.not` and `r.product` correctly.

## Credits

Thanks to [@TRGWII](https://github.com/TRGWII) for helping focus my ideas and trick TypeScript into doing the right things late at night at the cost of our sanities.
