type Predicate = (...x: any) => boolean;
type types = "string" | "number" | "symbol" | "boolean" | "object" | "undefined";

const _r = {
	T: () => true,
	F: () => false,
	any: () => true,

	nil: (x: any) => x == null,
	null: (x: any) => x === null,
	undefined: (x: any) => x === undefined,
	string: (x: any) => typeof x === "string",
	number: (x: any) => typeof x === "number",
	bool: (x: any) => x === true || x === false,
	symbol: (x: any) => typeof x === "symbol",
	object: (x: any) => typeof x === "object",

	is: (X: new (...args: any) => any, x: any) => x instanceof X,
	type: (name: string, x: any) => typeof x === name,
	toStringTag: (type: types, x: any) => x && x[Symbol.toStringTag] === type,
	or: (fs: Predicate[], x: any) => fs.reduce((last, f) => last || f(x), false),
	and: (fs: Predicate[], x: any) => fs.reduce((last, f) => last && f(x), true),
	maybe: (f: Predicate, x: any) => _r.or([f, _r.nil], x),
	refinement: (f: Predicate, g: Predicate, x: any) => _r.and([f, g], x),

	Array: (f: Predicate, xs: any[]) => xs.every(x => f(x)),
};

type Addn = "sum" | "product" | "optional" | "Struct";

const r: Record<keyof typeof _r, Predicate> &
	{ [k in Addn]: Predicate } & { P: (f: Predicate) => (...args: any) => Predicate } = {
	..._r,

	sum: _r.or,
	product: _r.and,
	optional: _r.maybe,

	P: f => (...args) => x => f(...args, x),

	Struct: (struct: Record<string, Predicate>, x) => {
		for (const key in struct) {
			const pred = struct[key];
			if (!pred(x[key])) return false;
		}

		return true;
	},
};
