import { LiteralTypes, NativeTypes, AnyConstructor, Predicate, GuardedType } from "../../util";
import { any } from "./always";

/** Literal equality of string, number, bigint, boolean, or symbol */
export const literal = <T extends LiteralTypes>(y: T) => (x: any): x is T => x === y;

/** Literal equality of string, number, bigint, boolean, or symbol */
export const equals = literal;

/** Check whether x is an instanceof X */
export const is = <Cons extends AnyConstructor>(X: Cons) => (x: any): x is InstanceType<Cons> => {
	try {
		return x.constructor === X || x instanceof X;
	} catch {
		return false;
	}
};

/** Check whether x is of type `name`, which is a possible typeof string, or "null" */
export const type = <T extends keyof NativeTypes>(name: T) => (x: any): x is NativeTypes[T] =>
	x === null ? name === "null" : typeof x === name;

/**
 * Check whether x has key and its value matches the type represented by pred.
 * pred defaults to `any`.
 */
export const has = <T extends string | number, Pred extends Predicate>(
	key: T,
	pred: Pred = any as any,
) => (x: any): x is Record<T, GuardedType<Pred>> => {
	try {
		return x.hasOwnProperty(key) && pred((x as any)[key]);
	} catch {
		return false;
	}
};
