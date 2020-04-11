import {
	Nil,
	Predicate,
	GuardedType,
	PredicatesToGuards,
	UnionToIntersection,
	LiteralTypes,
	Tuple,
	AnyStruct,
	GuardedStruct,
	CreateStructGuard,
} from "../../util";

import { any } from "./always";
import { Null, Undefined, nil } from "./primitives";

/** Checks whether x does not satisfy the predicate
 * WARNING: Type guards will fail with not. Negated types are not supported in TS!
 * See: Negated types https://github.com/Microsoft/TypeScript/pull/29317 */
export const not = <T extends Predicate>(f: T) => (x: any): x is Exclude<any, GuardedType<T>> =>
	!f(x);
//TODO: Negated type

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
): x is GuardedType<T> & GuardedType<U> => and([f, g])(x);

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
	either(f, Undefined)(x);

/** Check whether x satisfies predicate, or is nil. Alias to `maybe` */
export const optional = maybe;

/** Check whether x satisfies predicate, or is null */
export const nullable = <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | null =>
	either(f, Null)(x);

/** Check whether x satisfies predicate, or is nil */
export const nilable = <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | Nil =>
	either(f, nil)(x);

/** check whether x satisfies one of the given literal types */
export const oneOf = <Y extends LiteralTypes, Ys extends Y[]>(ys: Y[]) => (
	x: any,
): x is Ys[number] => ys.some(y => y === x);

/** Check whether x is a product type defined by fs */
export const product = <
	Predicates extends
		| Tuple<Predicate, 1>
		| Tuple<Predicate, 2>
		| Tuple<Predicate, 3>
		| Tuple<Predicate, 4>
		| Tuple<Predicate, 5>
		| Tuple<Predicate, 6>
		| Tuple<Predicate, 7>
		| Tuple<Predicate, 8>
		| Tuple<Predicate, 9>
		| Tuple<Predicate, 10>
		| Tuple<Predicate, 11>
		| Tuple<Predicate, 12>
		| Tuple<Predicate, 13>
		| Tuple<Predicate, 14>
		| Tuple<Predicate, 15>,
	GuardTuple extends PredicatesToGuards<Predicates>
>(
	fs: Predicates,
) => (xs: any): xs is GuardTuple => {
	//TODO: variadic, type-guard is limited from 1 to 15 Predicates
	try {
		return fs.every((f, i) => f(xs[i]));
	} catch {
		return false;
	}
};
/** Check whether x is a tuple of type defined by fs */
export const tuple = product;

/// ----- Array and Struct ----- ////

/** Check whether all elements of x satisfy predicate */
export const array = <T extends Predicate>(f: T) => (xs: any[]): xs is Array<GuardedType<T>> => {
	try {
		// minor optimisation to ignore iterating in case of array(any)
		if (f === (any as Predicate)) {
			return Array.isArray(xs);
		}
		return xs.every(x => f(x));
	} catch {
		return false;
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
