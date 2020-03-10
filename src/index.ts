export type Nil = null | undefined;
export type AnyConstructor = new (...args: any) => any;
export type ObjWithStrTag<U extends string> = { [Symbol.toStringTag]: U; [k: string]: any };

export type callback = (passing: boolean, msg?: string) => void;

export type Predicate = (x: any, f?: callback) => boolean;
export type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;

export type AnyStruct = {
	[k in string | number | symbol]: Predicate | AnyStruct;
};

export type GuardedStruct<Struct> = Struct extends (...x: any[]) => any
	? GuardedType<Struct>
	: {
			[K in keyof Struct]: GuardedStruct<Struct[K]>;
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

const wrapPred = <T extends Predicate>(f: T, msg: (x: any) => string): Predicate => (
	x: any,
	cb?: callback,
): x is GuardedType<T> => {
	const res = f(x);
	cb && cb(res, res ? msg(x) : undefined);
	return res;
};

const PrimitiveMsg = (types: string[]) => {
	return (ctx: any) => String(ctx) + " does not satisfy type " + types.join(" | ");
};

const primitives = {
	/// ----- Primitives ----- ////

	/** Check whether x is null or undefined */
	nil: wrapPred((x): x is Nil => x == null, PrimitiveMsg(["null", "undefined"])),

	/** Check whether x is null */
	null: wrapPred((x): x is null => x === null, PrimitiveMsg(["null"])),

	/** Check whether x is undefined */
	undefined: wrapPred((x): x is undefined => x === undefined, PrimitiveMsg(["undefined"])),

	/** Check whether x is a string */
	string: wrapPred((x): x is string => typeof x === "string", PrimitiveMsg(["string"])),

	/** Check whether x is a number */
	number: wrapPred((x): x is number => typeof x === "number", PrimitiveMsg(["number"])),

	/** Check whether x is a boolean */
	bool: wrapPred((x): x is boolean => x === true || x === false, PrimitiveMsg(["boolean"])),

	/** Check whether x is a symbol */
	symbol: wrapPred((x): x is symbol => typeof x === "symbol", PrimitiveMsg(["symbol"])),

	/** Check whether x is an object */
	object: wrapPred((x): x is object => !!x && typeof x === "object", PrimitiveMsg(["object"])),
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

const RuntimeMsg = (types: string[]) => {
	return (ctx: any) => String(ctx) + " does not satisfy type " + types.join(" | ");
};

const runtime = {
	/// ----- Runtime type related ----- ////

	/** Check whether x is an instanceof X */
	is: <T extends AnyConstructor>(X: T) =>
		wrapPred(
			(x): x is InstanceType<T> => {
				try {
					return x.constructor === X || x instanceof X;
				} catch {
					return false;
				}
			},
			x => `${x} is not an instance of ${primitives.object(X) ? X.name : "Invalid constructor"}`,
		),

	/** Check whether x is of type name */
	type: <T extends keyof NativeTypes>(name: T) =>
		wrapPred(
			(x: any): x is NativeTypes[T] => (name === "null" && x === null) || typeof x === name,
			x => `${x} does not have typeof ${name}`,
		),

	/** Check whether x has a [Symbol.toStringTag] of type */
	stringTag: <T extends string>(type: T) =>
		wrapPred(
			(x: any): x is ObjWithStrTag<T> => {
				try {
					return x[Symbol.toStringTag] === type;
				} catch {
					return false;
				}
			},
			x => `${x} does not contain [Symbol.toStringTag] equal to ${type}`,
		),
};

const combiners = {
	/// ----- Combiners ----- ////

	/** Checks whether x does not satisfy the predicate */
	not: (f: Predicate) =>
		wrapPred(
			//TODO: Negated types https://github.com/Microsoft/TypeScript/pull/29317
			(x: any) => !f(x),
			x => `${x} does not satisfy the NOT condition provided`,
		),

	/** Check whether x satisfies at least one of the predicates */
	or: (fs: Predicate[]) => (x: any, cb?: callback) => {
		//TODO: variadic, couldn't be type-guarded yet
		try {
			return fs.reduce((last, f) => last || f(x), false);
		} catch {
			return false;
		}
	},

	/** Check whether x satisfies all predicates */
	and: (fs: Predicate[]) => (x: any, cb?: callback) => {
		//TODO: variadic, couldn't be type-guarded yet
		try {
			return fs.reduce((last, f) => last && f(x), true);
		} catch {
			cb && cb(false, `${x} does not pass all conditions provided to r.and`);
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
	): x is GuardedType<T | U> => !!(f && g) && (f(x) || g(x)),

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
