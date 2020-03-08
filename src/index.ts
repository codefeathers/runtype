type Predicate = (...x: any) => boolean;
type Nil = null | undefined;
type AnyConstructor = new (...args: any) => any;
type ObjWithStrTag<U extends string> = { [Symbol.toStringTag]: U; [k: string]: any };
type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;

const always = {
	/// ----- Always conditions ----- ////

	/** Always pass */
	any: () => true,

	/** Always pass */
	ignore: () => true,

	/** Always pass */
	T: () => true,

	/** Always fail */
	F: () => false,
};

const primitives = {
	/// ----- Primitives ----- ////

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

const runtime = {
	/// ----- Runtime type related ----- ////

	/** Check whether x is an instanceof X */
	is: <T extends AnyConstructor>(X: T) => (x: any): x is InstanceType<T> => {
		try {
			return x.constructor === X || x instanceof X;
		} catch {
			return false;
		}
	},

	/** Check whether x is of type name */
	type: <T extends keyof NativeTypes>(name: T) => (x: any): x is NativeTypes[T] =>
		(name === "null" && x === null) || typeof x === name,

	/** Check whether x has a [Symbol.toStringTag] of type */
	stringTag: <T extends string>(type: T) => (x: any): x is ObjWithStrTag<T> => {
		try {
			return x[Symbol.toStringTag] === type;
		} catch {
			return false;
		}
	},
};

const combiners = {
	/// ----- Combiners ----- ////

	/** Checks whether x does not satisfy the predicate */
	not: (f: Predicate) => (x: any) => !f(x),
	//TODO: Negated types https://github.com/Microsoft/TypeScript/pull/29317

	/** Check whether x satisfies at least one of the predicates */
	or: (fs: Predicate[]) => (x: any) => {
		//TODO: variadic, couldn't be type-guarded yet
		try {
			return fs.reduce((last, f) => last || f(x), false);
		} catch {
			return false;
		}
	},

	/** Check whether x satisfies all predicates */
	and: (fs: Predicate[]) => (x: any) => {
		//TODO: variadic, couldn't be type-guarded yet
		try {
			return fs.reduce((last, f) => last && f(x), true);
		} catch {
			return false;
		}
	},

	/** Check whether x is a product of types defined by fs */
	product: (fs: Predicate[]) => (xs: any[]) => {
		//TODO: variadic, couldn't be type-guarded yet
		try {
			return fs.every((f, i) => f(xs[i]));
		} catch {
			return false;
		}
	},

	/** Check whether x satisfies predicate, or is nil */
	maybe: <T extends Predicate>(f: T) => (x: any): x is GuardedType<T> | Nil =>
		combiners.or([f, primitives.nil])(x),

	/** Check whether x satisfies either of two types */
	either: <T extends Predicate, U extends Predicate>(f: T, g: U) => (
		x: any,
	): x is GuardedType<T> | GuardedType<U> => f(x) || g(x),

	/** Check whether x satisfies a base type and a refinement */
	refinement: <T extends Predicate, U extends Predicate>(f: T, g: U) => (
		x: any,
	): x is GuardedType<T> & GuardedType<U> => combiners.and([f, g])(x),

	/// ----- Array and Struct ----- ////

	/** Check whether all elements of x satisfy predicate */
	Array: <T extends Predicate>(f: T) => (xs: any[]): xs is Array<GuardedType<T>> => {
		try {
			return xs.every(x => f(x));
		} catch {
			return false;
		}
	},

	/** Check the structure of an object to match a given predicate */
	Struct: <T extends string, U extends Predicate>(struct: Record<T, U>) => (
		x: any,
	): x is Record<keyof typeof struct, any> => {
		//TODO: complex & recursive, couldn't be type-guarded yet
		try {
			for (const key in struct) {
				const pred = struct[key];
				if (!pred(x[key])) return false;
			}

			return true;
		} catch {
			return false;
		}
	},
};

const aliases = {
	/// ----- Aliases ----- ////

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
};
