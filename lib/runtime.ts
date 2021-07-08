import { LiteralTypes, NativeTypes, AnyConstructor } from "../util.d.ts";

/** Literal equality of string, number, bigint, boolean, or symbol */
export const literal =
	<T extends LiteralTypes>(y: T) =>
	(x: unknown): x is T =>
		x === y;

/** Check whether x is an instanceof X */
export const is =
	<Cons extends AnyConstructor>(X: Cons) =>
	(x: unknown): x is InstanceType<Cons> => {
		try {
			// TODO(mkr): benchmark try/catch against typeof x === "object" &&
			// @ts-ignore If this throws, we'll catch it
			return x.constructor === X || x instanceof X;
		} catch {
			return false;
		}
	};

/** Check whether x is of type `name`, which is a possible typeof string, or "null" */
export const type =
	<T extends keyof NativeTypes>(name: T) =>
	(x: unknown): x is NativeTypes[T] =>
		x === null ? name === "null" : typeof x === name;
