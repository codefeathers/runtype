import {
	AnyConstructor,
	GuardedType,
	UnionToIntersection,
	GuardedStruct,
	Nil,
	ObjWithStrTag,
	AnyStruct,
	Predicate,
	PredicatesToGuards,
	Tuple,
} from "../util";

const T = () => true;
const F = () => false;

const always = {
	/// ----- Always conditions ----- ///

	/** Always pass */
	any: T,

	/** Always pass */
	ignore: T,

	/** Always pass */
	T,

	/** Always fail */
	F,
};

const primitives = {
	/// ----- Primitives ----- ///

	/** Check whether x is null or undefined */
	nil: (x: any): x is Nil => x == null,

	/** Check whether x is null */
	null: (x: any): x is null => x === null,

	/** Check whether x is undefined */
	undefined: (x: any): x is undefined => x === undefined,

	/** Check whether x is a string */
	string: (x: any): x is string => typeof x === "string",

	/** Check whether x is a number */
	number: (x: any): x is number => typeof x === "number",

	/** Check whether x is a boolean */
	bool: (x: any): x is boolean => x === true || x === false,

	/** Check whether x is a symbol */
	symbol: (x: any): x is symbol => typeof x === "symbol",

	/** Check whether x is an object */
	object: (x: any): x is object => !!x && typeof x === "object",
};

type NativeTypes = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	undefined: undefined;
	object: object;
	function: Function;
	symbol: symbol;
	bigint: bigint;
};

interface literal {
	<T extends string>(y: T): (x: any) => x is T;
	<T extends number>(y: T): (x: any) => x is T;
	<T extends boolean>(y: T): (x: any) => x is T;
	<T extends object>(y: T): (x: any) => x is T;
}

const literal: literal = <T extends string | number | boolean | object>(y: T) => (x: any): x is T =>
	x === y;

const runtime = {
	/// ----- Runtime type related ----- ////

	/** Literal equality of string, number, boolean, or object */
	literal,

	/** Literal equality of string, number, boolean, or object */
	equals: literal,

	/** Check whether x is an instanceof X */
	is: <T extends AnyConstructor>(X: T) => (x: any): x is InstanceType<T> => {
		try {
			return x.constructor === X || x instanceof X;
		} catch {
			return false;
		}
	},

	/** Check whether x is of type `name`, which is a possible typeof string, or "null" */
	type: <T extends keyof NativeTypes>(name: T) => (x: any): x is NativeTypes[T] =>
		x === null ? name === "null" : typeof x === name,

	/** Check whether x has a [Symbol.toStringTag] value equal to `name` */
	stringTag: <T extends string>(name: T) => (x: any): x is ObjWithStrTag<T> => {
		try {
			return x[Symbol.toStringTag] === name;
		} catch {
			return false;
		}
	},
};

const combiners = {
	/// ----- Combiners ----- ///

	/** Checks whether x does not satisfy the predicate
	 * WARNING: Type guards will fail with not. Negated types are not supported in TS!
	 * See: Negated types https://github.com/Microsoft/TypeScript/pull/29317 */
	not: <T extends Predicate>(f: T) => (x: any): x is Exclude<any, GuardedType<T>> => !f(x),
	//TODO: Negated type

	/** Exclude type represented by g from type represented by f */
	exclude: <T extends Predicate, U extends Predicate>(f: T, g: U) => (
		x: any,
	): x is Exclude<GuardedType<T>, GuardedType<U>> => f(x) && !g(x),

	/** Check whether x satisfies at least one of the predicates */
	or: <Predicates extends Predicate[], GuardUnion extends PredicatesToGuards<Predicates>[number]>(
		fs: Predicates,
	) => (x: any): x is GuardUnion => {
		try {
			return fs.reduce((last, f) => last || f(x), false as boolean);
		} catch {
			return false;
		}
	},

	/** Check whether x satisfies all predicates */
	and: <Predicates extends Predicate[], GuardUnion extends PredicatesToGuards<Predicates>[number]>(
		fs: Predicates,
	) => (x: any): x is UnionToIntersection<GuardUnion> => {
		try {
			return fs.reduce((last, f) => last && f(x), true as boolean);
		} catch {
			return false;
		}
	},

	/** Check whether x is a product type defined by fs */
	product: <
		// Predicates extends readonly Predicate[],
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
		//TODO: variadic, type-guard is limited from 2 to 15 Predicates
		try {
			return fs.every((f, i) => f(xs[i]));
		} catch {
			return false;
		}
	},

	/** Check whether x satisfies either of two types */
	either: <T extends Predicate, U extends Predicate>(f: T, g: U) => (
		x: any,
	): x is GuardedType<T | U> => !!(f && g) && (f(x) || g(x)),

	/** Check whether x satisfies predicate, or is nil */
	maybe: <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | Nil =>
		combiners.either(f, primitives.nil)(x),

	/** Check whether x satisfies a base type and a refinement */
	refinement: <T extends Predicate, U extends Predicate>(f: T, g: U) => (
		x: any,
	): x is GuardedType<T> & GuardedType<U> => combiners.and([f, g])(x),

	/// ----- Array and Struct ----- ////

	/** Check whether all elements of x satisfy predicate */
	Array: <T extends Predicate>(f: T) => (xs: any[]): xs is Array<GuardedType<T>> => {
		try {
			// minor optimisation to ignore iterating in case of r.Array(r.any)
			if (f === (T as Predicate)) {
				return Array.isArray(xs);
			}
			return xs.every(x => f(x));
		} catch {
			return false;
		}
	},

	/** Check the structure of an object to match a given predicate */
	Struct: <Struct extends AnyStruct>(struct: Struct) => (x: any): x is GuardedStruct<Struct> => {
		try {
			for (const key in struct) {
				const pred = (struct[key] && typeof struct[key] === "object"
					? // Assert because TypeScript does not understand that this narrows out Predicate
					  combiners.Struct(struct[key] as AnyStruct)
					: // Or that this leaves us with Predicate
					  struct[key]) as Predicate;
				if (!pred(x[key])) return false;
			}

			return true;
		} catch {
			return false;
		}
	},
};

const object = {
	/// ----- Object ----- ///
	/** Check whether object has property; object must be clearly typed ahead of time */
	has: <O extends { [k: string]: any }>(o: O) => (x: any): x is keyof O => o.hasOwnProperty(x),
};

const aliases = {
	/// ----- Aliases ----- ///

	/** Check whether x satisfies at least one of the predicates */
	sum: combiners.or,

	/** Check whether x satisfies at least one of the predicates */
	union: combiners.or,

	/** Check whether x is a tuple of type defined by fs */
	tuple: combiners.product,

	/** Check whether x satisfies predicate, or is nil */
	optional: combiners.maybe,
};

export default {
	...always,
	...primitives,
	...runtime,
	...combiners,
	...aliases,
	...object,
};

const unsafeBase = {
	/** Pass a type parameter and runtype will trust the type you think x is */
	own: <T>(x: any): x is T => true,
};

export const unsafe = {
	...unsafeBase,
	/** Pass a type parameter and runtype will trust the type you think it is */
	as: unsafeBase.own,
};
