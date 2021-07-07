import { expectGuard, assertEquals } from "../test-util.ts";

import { number, string, boolean, bigint } from "./primitives.ts";
import {
	optional,
	nullable,
	nilable,
	struct,
	array,
	or,
	and,
} from "./combinators.ts";

Deno.test({
	name: "optional",
	fn: () => {
		{
			const test = optional(number);

			expectGuard<number | undefined, typeof test>(true);

			assertEquals(true, test(5));
			assertEquals(true, test(undefined));

			assertEquals(false, test(null));
			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "nullable",
	fn: () => {
		{
			const test = nullable(number);

			expectGuard<number | null, typeof test>(true);

			assertEquals(true, test(5));
			assertEquals(true, test(null));

			assertEquals(false, test(undefined));
			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "nilable",
	fn: () => {
		{
			const test = nilable(number);

			expectGuard<number | undefined | null, typeof test>(true);

			assertEquals(true, test(5));
			assertEquals(true, test(null));
			assertEquals(true, test(undefined));

			assertEquals(false, test(""));
			assertEquals(false, test("5"));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "struct",
	fn: () => {
		{
			const test = struct({ x: string, y: number });

			expectGuard<{ x: string; y: number }, typeof test>(true);

			assertEquals(true, test({ x: "", y: 0 }));
			assertEquals(true, test({ x: "x", y: 10 }));

			assertEquals(false, test(null));
			assertEquals(false, test({}));
			assertEquals(false, test({ x: "" }));
			assertEquals(false, test({ y: "" }));
			assertEquals(false, test({ x: "", y: "" }));
			assertEquals(false, test({ x: 0, y: 0 }));
		}
	},
});

Deno.test({
	name: "nested struct",
	fn: () => {
		{
			const test = struct({
				x: string,
				y: struct({ p: boolean, q: optional(bigint) }),
			});

			expectGuard<{ x: string; y: { p: boolean; q?: bigint } }, typeof test>(
				true,
			);

			assertEquals(true, test({ x: "", y: { p: true } }));
			assertEquals(true, test({ x: "", y: { p: false, q: 0n } }));

			assertEquals(false, test({ x: "", y: { q: 10n } }));
			assertEquals(false, test({ x: {}, y: {} }));
			assertEquals(false, test({ x: "x", y: 10 }));
			assertEquals(false, test({ x: "", y: "" }));
			assertEquals(false, test({ x: 0, y: 0 }));
			assertEquals(false, test({ x: "" }));
			assertEquals(false, test({ y: "" }));
			assertEquals(false, test(null));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "deep struct",
	fn: () => {
		{
			const test = struct({
				x: string,
				y: { p: boolean, q: optional(bigint) },
			});

			expectGuard<{ x: string; y: { p: boolean; q?: bigint } }, typeof test>(
				true,
			);

			assertEquals(true, test({ x: "", y: { p: true } }));
			assertEquals(true, test({ x: "", y: { p: false, q: 0n } }));

			assertEquals(false, test({ x: "", y: { q: 10n } }));
			assertEquals(false, test({ x: {}, y: {} }));
			assertEquals(false, test({ x: "x", y: 10 }));
			assertEquals(false, test({ x: "", y: "" }));
			assertEquals(false, test({ x: 0, y: 0 }));
			assertEquals(false, test({ x: "" }));
			assertEquals(false, test({ y: "" }));
			assertEquals(false, test(null));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "array",
	fn: () => {
		{
			const test = array(number);

			expectGuard<number[], typeof test>(true);

			const fixture: any = 5;

			assertEquals(true, test([5]));
			assertEquals(true, test([]));

			assertEquals(false, test([""]));
			assertEquals(false, test([5, ""]));
			assertEquals(false, test([undefined]));
			assertEquals(false, test([null]));
			assertEquals(false, test([{}]));
			assertEquals(false, test(fixture));
		}
	},
});

Deno.test({
	name: "multi-dimensional array",
	fn: () => {
		{
			const test = array(array(number));

			expectGuard<number[][], typeof test>(true);

			const fixture: any = 5;

			assertEquals(true, test([[5]]));
			assertEquals(
				true,
				test([
					[1, 2],
					[3, 4],
				]),
			);

			assertEquals(false, test([5]));
			assertEquals(false, test([""]));
			assertEquals(false, test([5, ""]));
			assertEquals(false, test([undefined]));
			assertEquals(false, test([null]));
			assertEquals(false, test([{}]));
			assertEquals(false, test(fixture));
		}
	},
});

Deno.test({
	name: "struct and array",
	fn: () => {
		{
			const test = struct({ x: { ys: array(array(number)) } });

			expectGuard<{ x: { ys: number[][] } }, typeof test>(true);

			const fixture: any = 5;

			assertEquals(true, test({ x: { ys: [[5]] } }));
			assertEquals(
				true,
				test({
					x: {
						ys: [
							[1, 2],
							[3, 4],
						],
					},
				}),
			);

			assertEquals(false, test([5]));
			assertEquals(false, test([""]));
			assertEquals(false, test([5, ""]));
			assertEquals(false, test([undefined]));
			assertEquals(false, test([null]));
			assertEquals(false, test([{}]));
			assertEquals(false, test(fixture));
		}
	},
});

Deno.test({
	name: "or",
	fn: () => {
		{
			const test = or(string, number);

			expectGuard<string | number, typeof test>(true);

			assertEquals(true, test(5));
			assertEquals(true, test("5"));
			assertEquals(true, test(0));
			assertEquals(true, test(""));

			assertEquals(false, test(undefined));
			assertEquals(false, test(null));
			assertEquals(false, test([]));
			assertEquals(false, test({}));
		}
	},
});

Deno.test({
	name: "and",
	fn: () => {
		{
			const x = struct({ x: string });
			const y = struct({ y: number });

			const test = and(x, y);

			expectGuard<{ x: string } & { y: number }, typeof test>(true);

			assertEquals(true, test({ x: "", y: 0 }));
			assertEquals(true, test({ x: "x", y: 10 }));

			assertEquals(false, test(null));
			assertEquals(false, test({}));
			assertEquals(false, test({ x: "" }));
			assertEquals(false, test({ y: "" }));
			assertEquals(false, test({ x: "", y: "" }));
			assertEquals(false, test({ x: 0, y: 0 }));
		}
	},
});
