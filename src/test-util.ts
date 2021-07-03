import { GuardedPredicate, GuardedType } from "./util.d.ts";
import { TypeEqual } from "https://raw.githubusercontent.com/TypeStrong/ts-expect/master/src/index.ts";

export { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
export { expectType as expectValue } from "https://raw.githubusercontent.com/TypeStrong/ts-expect/master/src/index.ts";

export const expectType = <
	Target,
	Value,
	Accepted extends
		TypeEqual<Target, Value> =
			TypeEqual<Target, Value>,
>(ret: Accepted): void => void 0;

export const expectGuard = <
	Target,
	Guard extends GuardedPredicate<Target> = GuardedPredicate<Target>,
	Accepted extends
		TypeEqual<Target, GuardedType<Guard>> =
			TypeEqual<Target, GuardedType<Guard>>,
>(accepted: Accepted): void => void 0;
