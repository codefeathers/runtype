import { expectGuard, assertEquals } from "./test-util.ts";

import { is, literal, type } from "./runtime.ts";

Deno.test({
	name: "is",
	fn: () => {
		{
			class Fixture {
				constructor(public x: string) {}
			}

			const fixture = new Fixture("value");

			const test = is(Fixture);

			expectGuard<Fixture, typeof test>(true);

			assertEquals(true, test(fixture));

			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "literal number",
	fn: () => {
		{
			const test = literal(5);

			expectGuard<5, typeof test>(true);

			assertEquals(true, test(5));

			assertEquals(false, test(10));
			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "literal string",
	fn: () => {
		{
			const test = literal("5");

			expectGuard<"5", typeof test>(true);

			assertEquals(true, test("5"));

			assertEquals(false, test(10));
			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test(""));
			assertEquals(false, test("50"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "literal symbol",
	fn: () => {
		{
			const fixture = Symbol("hello");
			const test = literal(fixture);

			expectGuard<typeof fixture, typeof test>(true);

			assertEquals(true, test(fixture));

			assertEquals(false, test(Symbol("hello")));
			assertEquals(false, test(10));
			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test("5"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "type string",
	fn: () => {
		{
			const test = type("string");

			expectGuard<string, typeof test>(true);

			assertEquals(true, test(""));
			assertEquals(true, test("5"));

			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "type boolean",
	fn: () => {
		{
			const test = type("boolean");

			expectGuard<boolean, typeof test>(true);

			assertEquals(true, test(true));
			assertEquals(true, test(false));

			assertEquals(false, test(0));
			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "type string",
	fn: () => {
		{
			const test = type("number");

			expectGuard<number, typeof test>(true);

			assertEquals(true, test(5));
			assertEquals(true, test(Infinity));

			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "type string",
	fn: () => {
		{
			const test = type("null");

			expectGuard<null, typeof test>(true);

			assertEquals(true, test(null));

			assertEquals(false, test(Infinity));
			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test(undefined));
			assertEquals(false, test({}));
		}
	},
});
