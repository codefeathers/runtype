import { expectType, expectGuard, assertEquals } from "./test-util.ts";

import { Nil } from "../util.d.ts";
import {
	nul,
	undef,
	nil,
	number,
	string,
	boolean,
	bigint,
	symbol,
} from "./primitives.ts";

Deno.test({
	name: "Nil",
	fn: () => {
		expectType<Nil, null | undefined>(true);
	},
});

Deno.test({
	name: "null",
	fn: () => {
		{
			expectGuard<null, typeof nul>(true);

			assertEquals(true, nul(null));
			assertEquals(false, nul(undefined));
			assertEquals(false, nul(5));
			assertEquals(false, nul({}));
		}
	},
});

Deno.test({
	name: "undefined",
	fn: () => {
		{
			expectGuard<undefined, typeof undef>(true);

			assertEquals(true, undef(undefined));
			assertEquals(false, undef(null));
			assertEquals(false, undef(5));
			assertEquals(false, undef({}));
		}
	},
});

Deno.test({
	name: "nil",
	fn: () => {
		{
			expectGuard<Nil, typeof nil>(true);

			assertEquals(true, nil(null));
			assertEquals(true, nil(undefined));
			assertEquals(false, nil(""));
			assertEquals(false, nil({}));
			assertEquals(false, nil(0));
		}
	},
});

Deno.test({
	name: "number",
	fn: () => {
		{
			expectGuard<number, typeof number>(true);

			assertEquals(true, number(5));
			assertEquals(true, number(NaN));
			assertEquals(true, number(Infinity));

			assertEquals(false, number(undefined));
			assertEquals(false, number("5"));
			assertEquals(false, number({}));
		}
	},
});

Deno.test({
	name: "string",
	fn: () => {
		{
			expectGuard<string, typeof string>(true);

			assertEquals(true, string("5"));
			assertEquals(true, string("Infinity"));

			assertEquals(false, string(undefined));
			assertEquals(false, string(5));
			assertEquals(false, string({}));
		}
	},
});

Deno.test({
	name: "boolean",
	fn: () => {
		{
			expectGuard<boolean, typeof boolean>(true);

			assertEquals(true, boolean(true));
			assertEquals(true, boolean(false));

			assertEquals(false, boolean(undefined));
			assertEquals(false, boolean(0));
			assertEquals(false, boolean(1));
			assertEquals(false, boolean("true"));
			assertEquals(false, boolean("5"));
			assertEquals(false, boolean({}));
		}
	},
});

Deno.test({
	name: "bigint",
	fn: () => {
		{
			expectGuard<bigint, typeof bigint>(true);

			assertEquals(true, bigint(0n));
			assertEquals(true, bigint(1n));
			assertEquals(true, bigint(100n));

			assertEquals(false, bigint(0));
			assertEquals(false, bigint(1));
			assertEquals(false, bigint(undefined));
			assertEquals(false, bigint("5n"));
			assertEquals(false, bigint("5"));
			assertEquals(false, bigint({}));
		}
	},
});

Deno.test({
	name: "symbol",
	fn: () => {
		{
			expectGuard<symbol, typeof symbol>(true);

			assertEquals(true, symbol(Symbol()));
			assertEquals(true, symbol(Symbol("hello")));
			assertEquals(true, symbol(Symbol.for("hello")));
			assertEquals(true, symbol(Symbol.iterator));

			assertEquals(false, symbol(Symbol));
			assertEquals(false, symbol(undefined));
			assertEquals(false, symbol("Symbol"));
			assertEquals(false, symbol("5"));
			assertEquals(false, symbol({}));
		}
	},
});
