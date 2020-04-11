const test = require("ava");

const r = require("./dist");

test("T", t => {
	const res = r.T();
	t.true(res);
});

test("F", t => {
	const res = r.F();
	t.false(res);
});

test("any", t => {
	const res = r.any();
	t.true(res);
});

test("nil", t => {
	t.plan(4);
	{
		// undefined
		const res = r.nil();
		t.true(res);
	}
	{
		// undefined, expicit
		const res = r.nil(undefined);
		t.true(res);
	}
	{
		// null
		const res = r.nil(null);
		t.true(res);
	}
	{
		// falsy
		const res = r.nil(0);
		t.false(res);
	}
});

test("null", t => {
	t.plan(3);
	{
		// undefined
		const res = r.Null();
		t.false(res);
	}
	{
		// undefined, expicit
		const res = r.Null(undefined);
		t.false(res);
	}
	{
		// null
		const res = r.Null(null);
		t.true(res);
	}
});

test("undefined", t => {
	t.plan(3);
	{
		// undefined
		const res = r.Undefined();
		t.true(res);
	}
	{
		// undefined, explicit
		const res = r.Undefined(undefined);
		t.true(res);
	}
	{
		//explicit null
		const res = r.Undefined(null);
		t.false(res);
	}
});

test("string", t => {
	t.plan(4);
	{
		// undefined
		const res = r.string();
		t.false(res);
	}
	{
		// empty string
		const res = r.string("");
		t.true(res);
	}
	{
		// proper string
		const res = r.string("Hello");
		t.true(res);
	}
	{
		// non-string
		const res = r.string(5);
		t.false(res);
	}
});

test("number", t => {
	t.plan(4);
	{
		// without params
		const res = r.number();
		t.false(res);
	}
	{
		// with simple param
		const res = r.number(5);
		t.true(res);
	}
	{
		// with NaN
		const res = r.number(NaN);
		t.true(res);
	}
	{
		// with undefined
		const res = r.number(undefined);
		t.false(res);
	}
});

test("bool", t => {
	t.plan(3);
	{
		// without params
		const res = r.bool();
		t.false(res);
	}
	{
		// with true
		const res = r.bool(true);
		t.true(res);
	}
	{
		// with false
		const res = r.bool(false);
		t.true(res);
	}
});

test("symbol", t => {
	t.plan(3);
	{
		// without param
		const res = r.symbol();
		t.false(res);
	}
	{
		// with symbol
		const res = r.symbol(Symbol("symbol"));
		t.true(res);
	}
	{
		// with well-known symbol
		const res = r.symbol(Symbol.iterator);
		t.true(res);
	}
});

test("object", t => {
	t.plan(5);
	{
		// without param
		const res = r.object();
		t.false(res);
	}
	{
		// with null
		const res = r.object(null);
		t.false(res);
	}
	{
		// with object literal
		const res = r.object({});
		t.true(res);
	}
	{
		// with array literal
		const res = r.object([]);
		t.true(res);
	}
	{
		// with Map
		const res = r.object(new Map());
		t.true(res);
	}
});

test("is", t => {
	t.plan(8);
	{
		// without param
		const res = r.is()();
		t.false(res);
	}
	{
		// with garbage
		const res = r.is(5)(5);
		t.false(res);
	}
	{
		// with more garbage
		const res = r.is("5")(5);
		t.false(res);
	}
	{
		// with even more garbage
		const res = r.is([])(5);
		t.false(res);
	}
	{
		// with Object constructor
		const res = r.is(Object)({});
		t.true(res);
	}
	{
		// with Array constructor
		const res = r.is(Array)([]);
		t.true(res);
	}
	{
		// with Set constructor
		const res = r.is(Set)(new Set());
		t.true(res);
	}
	{
		// with Map constructor
		const res = r.is(Map)(new Map());
		t.true(res);
	}
});

test("type", t => {
	t.plan(9);
	{
		// without param
		const res = r.type()();
		t.false(res);
	}
	{
		// without one param
		const res = r.type("string")();
		t.false(res);
	}
	{
		// with "undefined"
		const res = r.type("undefined")();
		t.true(res);
	}
	{
		// with "string"
		const res = r.type("string")("");
		t.true(res);
	}
	{
		// with "number", but wrong input
		const res = r.type("number")("");
		t.false(res);
	}
	{
		// with "number"
		const res = r.type("number")(10);
		t.true(res);
	}
	{
		// with "object"
		const res = r.type("object")([]);
		t.true(res);
	}
	{
		// with "object", but null as input
		const res = r.type("object")(null);
		t.false(res);
	}
	{
		// with "null" and null
		const res = r.type("null")(null);
		t.true(res);
	}
});

test("stringTag", t => {
	{
		// without param
		const res = r.stringTag()();
		t.false(res);
	}
	{
		// with incorrect string tag
		class X {
			get [Symbol.toStringTag]() {
				return "X";
			}
		}
		const x = new X();
		const res = r.stringTag("Y")(x);
		t.false(res);
	}
	{
		// with correct param
		class X {
			get [Symbol.toStringTag]() {
				return "X";
			}
		}
		const x = new X();
		const res = r.stringTag("X")(x);
		t.true(res);
	}
});

test("either", t => {
	{
		// without params
		const res = r.either()();
		t.false(res);
	}
	{
		// with matching predicates
		const res = r.either(r.string, r.number)(20);
		t.true(res);
	}
	{
		// with non-matching predicates
		const res = r.either(r.string, r.number)({});
		t.false(res);
	}
});

test("or", t => {
	t.plan(4);
	{
		// without params
		const res = r.or([])();
		t.false(res);
	}
	{
		// with single predicate
		const res = r.or([r.string])("");
		t.true(res);
	}
	{
		// with several predicates
		const res = r.or([r.string, r.number, r.bool])(5);
		t.true(res);
	}
	{
		// with several predicates, none of which are satisfied
		const res = r.or([r.string, r.number, r.bool])(null);
		t.false(res);
	}
});

test("struct", t => {
	t.plan(2);
	{
		// with a valid struct
		const res = r.struct({
			x: r.string,
			y: r.number,
			z: {
				a: r.array(r.either(r.number, r.string)),
			},
		})({
			x: "string",
			y: 42,
			z: {
				a: ["string", 42, "string", "string"],
			},
		});

		t.true(res);
	}
	{
		// with a valid struct
		const res = r.struct({
			x: r.number,
			y: r.number,
			z: {
				a: r.array(r.either(r.number, r.string)),
			},
		})({
			x: "string",
			y: 42,
			z: {
				a: ["string", 42, "string", "string"],
			},
		});

		t.false(res);
	}
});
