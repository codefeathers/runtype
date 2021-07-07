import { expectGuard, assertEquals } from "../test-util.ts";

import { number, string, boolean, bigint } from "./primitives.ts";

import {
	union,
	intersect,
	exclude,
	tuple,
	extend,
	oneOf,

	// deps
	struct,
	optional,
} from "./combinators.ts";

struct({ x: optional(number) });

Deno.test({
	name: "union",
	fn: () => {
		{
			const test = union([string, number, boolean]);

			expectGuard<string | number | boolean, typeof test>(true);

			assertEquals(true, test(5));
			assertEquals(true, test("5"));
			assertEquals(true, test(true));
			assertEquals(true, test(0));
			assertEquals(true, test(""));
			assertEquals(true, test(false));

			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test([]));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "intersect",
	fn: () => {
		{
			const x = struct({ x: string });
			const y = struct({ y: number });
			const z = struct({ z: boolean });

			const test = intersect([x, y, z]);

			expectGuard<{ x: string } & { y: number } & { z: boolean }, typeof test>(
				true,
			);

			assertEquals(true, test({ x: "", y: 0, z: true }));
			assertEquals(true, test({ x: "x", y: 10, z: false }));
			assertEquals(true, test({ x: "", y: 0, z: false }));
			assertEquals(true, test({ x: "x", y: 10, z: true }));

			assertEquals(false, test(null));
			assertEquals(false, test({}));
			assertEquals(false, test({ x: "" }));
			assertEquals(false, test({ y: "" }));
			assertEquals(false, test({ x: "", y: "", z: "" }));
			assertEquals(false, test({ x: 0, y: 0, z: 0 }));
			assertEquals(false, test({ x: true, y: false, z: true }));
		}
	},
});

Deno.test({
	name: "exclude",
	fn: () => {
		{
			const test = exclude(union([number, string]), number);

			expectGuard<string, typeof test>(true);

			assertEquals(true, test("5"));
			assertEquals(true, test("Infinity"));

			assertEquals(false, test(undefined));
			assertEquals(false, test(5));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "tuple",
	fn: () => {
		{
			const test = tuple([string, number, boolean]);

			expectGuard<[string, number, boolean], typeof test>(true);

			assertEquals(true, test(["", 0, true]));
			assertEquals(true, test(["x", 10, false]));
			assertEquals(true, test(["", 0, false]));
			assertEquals(true, test(["x", 10, true]));

			assertEquals(false, test(null));
			assertEquals(false, test({}));
			assertEquals(false, test([""]));
			assertEquals(false, test([""]));
			assertEquals(false, test(["", "", ""]));
			assertEquals(false, test([0, 0, 0]));
			assertEquals(false, test([true, false, true]));
		}
	},
});

Deno.test({
	name: "extend",
	fn: () => {
		{
			const test = extend(struct({ x: string }), { y: number });

			expectGuard<{ x: string } & { y: number }, typeof test>(true);

			assertEquals(true, test({ x: "", y: 0 }));
			assertEquals(true, test({ x: "x", y: 10 }));

			assertEquals(false, test({ x: "null" }));
			assertEquals(false, test({ x: "", y: false }));
			assertEquals(false, test({ x: "", y: {} }));
			assertEquals(false, test({ x: "", y: "" }));
		}
	},
});

Deno.test({
	name: "oneOf",
	fn: () => {
		{
			const test = oneOf([true, "true", 5, 5n]);

			expectGuard<true | "true" | 5 | 5n, typeof test>(true);

			assertEquals(true, test(true));
			assertEquals(true, test("true"));
			assertEquals(true, test(5));
			assertEquals(true, test(5n));

			assertEquals(false, test(50n));
			assertEquals(false, test(false));
			assertEquals(false, test(10));
			assertEquals(false, test("nope"));
			assertEquals(false, test({}));
		}
	},
});
