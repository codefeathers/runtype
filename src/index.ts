type Predicate = (...x: any) => boolean;
type types = "string" | "number" | "symbol" | "boolean" | "object" | "undefined";
type Nil = null | undefined;

const tryCatch = (f: any) => (x: any) => {
	try {
		if (f(x)) {
			return true;
		}
	} catch {
		return false;
	}
};

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
	object: (x: any) => !!x && typeof x === "object",
};

const runtime = {
	/// ----- Runtime type related ----- ////

	/** Check whether x is an instanceof X */
	is: (X: new (...args: any) => any) => tryCatch((x: any) => x.constructor === X || x instanceof X),

	/** Check whether x is of type name */
	type: (name: string) => (x: any) => (name === "null" && x === null) || typeof x === name,

	/** Check whether x has a [Symbol.toStringTag] of type */
	stringTag: (type: types) => tryCatch((x: any) => x[Symbol.toStringTag] === type),
};

const combiners = {
	/// ----- Combiners ----- ////

	/** Checks whether x does not satisfy the predicate */
	not: (f: Predicate) => (x: any) => !f(x),

	/** Check whether x satisfies at least one of the predicates */
	or: (fs: Predicate[]) => (x: any) => fs.reduce((last, f) => last || f(x), false),

	/** Check whether x satisfies all predicates */
	and: (fs: Predicate[]) => (x: any) => fs.reduce((last, f) => last && f(x), true),

	/** Check whether x satisfies predicate, or is nil */
	maybe: (f: Predicate) => (x: any) => combiners.or([f, primitives.nil])(x),

	/** Check whether x satisfies a base type and a refinement */
	refinement: (f: Predicate, g: Predicate) => (x: any) => combiners.and([f, g])(x),

	/** Check whether x is a product of types defined by fs */
	product: (fs: Predicate[]) => (xs: any[]) => fs.every((f, i) => f(xs[i])),

	/// ----- Array and Struct ----- ////

	/** Check whether all elements of x satisfy predicate */
	Array: (f: Predicate) => (xs: any[]) => xs.every(x => f(x)),

	/** Check the structure of an object to match a given predicate */
	Struct: (struct: Record<string, Predicate>) => (x: any) => {
		for (const key in struct) {
			const pred = struct[key];
			if (!pred(x[key])) return false;
		}

		return true;
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
