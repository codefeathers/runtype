import { expectGuard, assertEquals } from "./test-util.ts";

import { string } from "./primitives.ts";
import { and, struct } from "./combinators.ts";
import * as unsafe from "./unsafe.ts";

const { as, not } = unsafe;

Deno.test({
	name: "unsafe not",
	fn: () => {
		{
			const fixture = {};
			const fixture2 = { invalid: 5 };
			const fixture3 = { invalid: "" };

			const Invalid = struct({ invalid: string });

			const test = not(Invalid);

			expectGuard<unknown, typeof test>(true);

			assertEquals(true, test(fixture));
			assertEquals(true, test(fixture2));
			assertEquals(true, test(null));
			assertEquals(true, test(undefined));

			assertEquals(false, test(fixture3));
		}
	},
});

Deno.test({
	name: "unsafe as",
	fn: () => {
		{
			const fixture = {};
			const fixture2 = { invalid: 5 };
			const fixture3 = { invalid: "" };

			const AnyObject = struct({});
			const Invalid = struct({ invalid: string });
			type AnyObject = Record<string, unknown>;

			const test = as<AnyObject>(and(AnyObject, not(Invalid)));

			expectGuard<AnyObject, typeof test>(true);

			assertEquals(true, test(fixture));
			assertEquals(true, test(fixture2));

			assertEquals(false, test(fixture3));
			assertEquals(false, test(null));
			assertEquals(false, test(undefined));
		}
	},
});
