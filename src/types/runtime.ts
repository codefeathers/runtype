import { LiteralTypes, NativeTypes, AnyConstructor, ObjWithStrTag } from "../../util";

export interface literal {
	<T extends string>(y: T): (x: any) => x is T;
	<T extends number>(y: T): (x: any) => x is T;
	<T extends boolean>(y: T): (x: any) => x is T;
	<T extends object>(y: T): (x: any) => x is T;
	<T extends bigint>(y: T): (x: any) => x is T;
}

/** Literal equality of string, number, boolean, or object */
export const literal: literal = <T extends LiteralTypes>(y: T) => (x: any): x is T => x === y;

/** Literal equality of string, number, boolean, or object */
export const equals = literal;

/** Check whether x is an instanceof X */
export const is = <T extends AnyConstructor>(X: T) => (x: any): x is InstanceType<T> => {
	try {
		return x.constructor === X || x instanceof X;
	} catch {
		return false;
	}
};

/** Check whether x is of type `name`, which is a possible typeof string, or "null" */
export const type = <T extends keyof NativeTypes>(name: T) => (x: any): x is NativeTypes[T] =>
	x === null ? name === "null" : typeof x === name;

/** Check whether x has a [Symbol.toStringTag] value equal to `name` */
export const stringTag = <T extends string>(name: T) => (x: any): x is ObjWithStrTag<T> => {
	try {
		return x[Symbol.toStringTag] === name;
	} catch {
		return false;
	}
};

/** Check whether object has property; object must be clearly typed ahead of time */
export const has = <O extends { [k: string]: any }>(o: O) => (x: any): x is keyof O =>
	o.hasOwnProperty(x);
