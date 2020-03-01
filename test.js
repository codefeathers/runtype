const test = require("ava");

const { r } = require("./dist");

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

test("nil without param", t => {
	const res = r.nil();
	t.true(res);
});

test("nil with undefined", t => {
	const res = r.nil(undefined);
	t.true(res);
});

test("nil with falsy", t => {
	const res = r.nil(0);
	t.false(res);
});

test("null without param", t => {
	const res = r.null();
	t.false(res);
});

test("null with null", t => {
	const res = r.null(null);
	t.true(res);
});

test("undefined without param", t => {
	const res = r.undefined();
	t.true(res);
});

test("undefined with explicit undefined", t => {
	const res = r.undefined(undefined);
	t.true(res);
});

test("undefined with explicit null", t => {
	const res = r.undefined(null);
	t.false(res);
});

test("string without param", t => {
	const res = r.string();
	t.false(res);
});

test("string with empty string", t => {
	const res = r.string("");
	t.true(res);
});

test("string with proper string", t => {
	const res = r.string("Hello");
	t.true(res);
});

test("string with non-string", t => {
	const res = r.string(5);
	t.false(res);
});

test("number without params", t => {
	const res = r.number();
	t.false(res);
});

test("number with simple param", t => {
	const res = r.number(5);
	t.true(res);
});

test("number with NaN", t => {
	const res = r.number(NaN);
	t.true(res);
});

test("number with undefined", t => {
	const res = r.number(undefined);
	t.false(res);
});

test("bool without params", t => {
	const res = r.bool();
	t.false(res);
});

test("bool with true", t => {
	const res = r.bool(true);
	t.true(res);
});

test("bool with false", t => {
	const res = r.bool(false);
	t.true(res);
});

test("symbol without param", t => {
	const res = r.symbol();
	t.false(res);
});

test("symbol with symbol", t => {
	const res = r.symbol(Symbol("symbol"));
	t.true(res);
});

test("symbol with well-known symbol", t => {
	const res = r.symbol(Symbol.iterator);
	t.true(res);
});

test("object without param", t => {
	const res = r.object();
	t.false(res);
});

test("object with null", t => {
	const res = r.object(null);
	t.true(res);
});

test("object with object literal", t => {
	const res = r.object({});
	t.true(res);
});

test("object with array literal", t => {
	const res = r.object([]);
	t.true(res);
});

test("object with Map", t => {
	const res = r.object(new Map());
	t.true(res);
});

test("is without param", t => {
	const res = r.is();
	t.false(res);
});

test("is with garbage", t => {
	const res = r.type(5, 5);
	t.false(res);
});

test("is with more garbage", t => {
	const res = r.type("5", 5);
	t.false(res);
});

test("is with even more garbage", t => {
	const res = r.type([], 5);
	t.false(res);
});

test("is with Object constructor", t => {
	const res = r.type(Object, {});
	t.true(res);
});

test("is with Array constructor", t => {
	const res = r.type(Array, []);
	t.true(res);
});

test("is with Set constructor", t => {
	const res = r.type(Set, new Set());
	t.true(res);
});

test("is with Map constructor", t => {
	const res = r.type(Map, new Map());
	t.true(res);
});

test("type without param", t => {
	const res = r.type();
	t.false(res);
});

test("type without one param", t => {
	const res = r.type("string");
	t.false(res);
});

test("type with undefined", t => {
	const res = r.type("undefined");
	t.true(res);
});

test("type with string", t => {
	const res = r.type("string", "");
	t.true(res);
});

test("type with number, but wrong input", t => {
	const res = r.type("number", "");
	t.false(res);
});

test("type with number", t => {
	const res = r.type("number", 10);
	t.true(res);
});

test("type with object", t => {
	const res = r.type("object", []);
	t.true(res);
});

test("type with object, but null as input", t => {
	const res = r.type("object", null);
	t.true(res);
});

test("type with null and null", t => {
	const res = r.type("null", null);
	t.true(res);
});

test("toStringTag without param", t => {
	const res = r.toStringTag();
	t.false(res);
});

test("", t => {
	const res = r.or();
	t.true(res);
});

test("", t => {
	const res = r.and();
	t.true(res);
});

test("", t => {
	const res = r.maybe();
	t.true(res);
});

test("", t => {
	const res = r.refinement();
	t.true(res);
});
