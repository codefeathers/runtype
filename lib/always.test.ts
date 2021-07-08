import { expectValue } from "./test-util.ts";
import { GuardedPredicate } from "../util.d.ts";

import { any, never } from "./always.ts";

Deno.test({
	name: "any",
	fn: () => {
		expectValue<GuardedPredicate<any>>(any);
	},
});

Deno.test({
	name: "never",
	fn: () => {
		expectValue<GuardedPredicate<never>>(never);
	},
});
