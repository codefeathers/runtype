import {
	Nil,
	Predicate,
	GuardedType,
	PredicatesToGuards,
	UnionToIntersection,
	LiteralTypes,
	AnyStruct,
	GuardedStruct,
	CreateStructGuard,
} from "../../util";

import { Concat } from "../../tuple";

import { any } from "./always";
import { nil, primitive, number, string, symbol } from "./primitives";

/** Exclude type represented by g from type represented by f */
export const exclude = <T extends Predicate, U extends Predicate>(f: T, g: U) => (
	x: any,
): x is Exclude<GuardedType<T>, GuardedType<U>> => f(x) && !g(x);

/** Check whether x satisfies all predicates */
export const and = <
	Predicates extends Predicate[],
	GuardUnion extends PredicatesToGuards<Predicates>[number]
>(
	fs: Predicates,
) => (x: any): x is UnionToIntersection<GuardUnion> => {
	try {
		return fs.reduce((last, f) => last && f(x), true as boolean);
	} catch {
		return false;
	}
};

/** Check whether x satisfies a base type and a refinement */
export const refinement = <T extends Predicate, U extends Predicate>(f: T, g: U) => (
	x: any,
): x is GuardedType<T, never> & GuardedType<U, never> => !!(f && g) && f(x) && g(x);

/** Check whether x satisfies at least one of the predicates */
export const or = <
	Predicates extends Predicate[],
	GuardUnion extends PredicatesToGuards<Predicates>[number]
>(
	fs: Predicates,
) => (x: any): x is GuardUnion => {
	try {
		return fs.reduce((last, f) => last || f(x), false as boolean);
	} catch {
		return false;
	}
};

/** Check whether x satisfies at least one of the predicates. Alias to `or` */
export const sum = or;

/** Check whether x satisfies at least one of the predicates. Alias to `or` */
export const union = or;

/** Check whether x satisfies either of two types */
export const either = <T extends Predicate, U extends Predicate>(f: T, g: U) => (
	x: any,
): x is GuardedType<T | U> => !!(f && g) && (f(x) || g(x));

/** Check whether x satisfies predicate, or is undefined */
export const maybe = <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | undefined =>
	either(f, primitive.undefined)(x);

/** Check whether x satisfies predicate, or is nil. Alias to `maybe` */
export const optional = maybe;

/** Check whether x satisfies predicate, or is null */
export const nullable = <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | null =>
	either(f, primitive.null)(x);

/** Check whether x satisfies predicate, or is nil */
export const nilable = <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | Nil =>
	either(f, nil)(x);

/** check whether x satisfies one of the given literal types */
export const oneOf = <Y extends LiteralTypes, Ys extends Y[]>(ys: Y[]) => (
	x: any,
): x is Ys[number] => ys.some(y => y === x);

/**
 * Create a tuple type of arbitrary length. Safe to consume in an `extends` clause.
 * Do not do keyof on this.
 */
type Tuple<ElementT, L extends number> = Array<ElementT> & {
	0: ElementT;
	length: L;
};

interface product {
	<Predicates extends Tuple<Predicate, number>>(fs: Predicates): (
		xs: any,
	) => xs is PredicatesToGuards<Predicates>;
	<Predicates extends Tuple<Predicate, number>, Rest extends Predicate>(
		fs: Predicates,
		rest: Rest,
	): (xs: any) => xs is PredicatesToGuards<Concat<Predicates, [...Rest[]]>>;
}

/** Check whether x is an algebraic product type (tuple) defined by fs.
 * For an open ended tuple, pass a single predicate as second param */
export const product = ((fs: Predicate[], rest?: Predicate) => (xs: any) => {
	if (!Array.isArray(xs)) {
		return false;
	}
	if (rest) {
		// input must at least be the size of the predicate list
		if (xs.length < fs.length) {
			return false;
		} else {
			return xs.every((x, idx) => (idx < fs.length ? fs[idx](x) : rest(x)));
		}
	} else {
		// input must be exactly the size of the predicate list
		if (xs.length !== fs.length) {
			return false;
		} else {
			return xs.every((x, idx) => fs[idx](x));
		}
	}
	// Needs assertion to understand the type correctly
}) as product;

/** Check whether x is a tuple of type defined by fs */
export const tuple = product;

/// ----- Array and Struct ----- ////

/** Check whether all elements of x satisfy predicate */
export const array = <T extends Predicate>(f: T) => (xs: any[]): xs is Array<GuardedType<T>> => {
	if (!Array.isArray(xs)) {
		return false;
	}
	if (f === (any as Predicate)) {
		// minor optimisation to ignore iterating in case of array(any)
		return true;
	} else {
		return xs.every(x => f(x));
	}
};

/** Check the structure of an object to match a given predicate */
export const struct = <Struct extends AnyStruct>(structObj: Struct) => (
	x: any,
): x is GuardedStruct<Struct> => {
	try {
		for (const key in structObj) {
			const pred = (structObj[key] && typeof structObj[key] === "object"
				? // Assert because TypeScript does not understand that this narrows out Predicate
				  struct(structObj[key] as AnyStruct)
				: // Or that this leaves us with Predicate
				  structObj[key]) as Predicate;
			if (!pred(x[key])) return false;
		}

		return true;
	} catch {
		return false;
	}
};

/**
 * Takes a Predicate and Struct, x is validated against the predicate's
 * type at compile time, and validated against both at runtime
 *
 * Similar to refinement, but with a compile-time check
 * and bare object as second param
 */
export const extend = <
	T extends Predicate,
	Struct extends Partial<CreateStructGuard<GuardedType<T>>> & AnyStruct
>(
	f: T,
	structObj: Struct,
) => <X extends GuardedType<T>>(x: X): x is X & GuardedStruct<Struct> => {
	return f(x) && struct(structObj)(x);
};
