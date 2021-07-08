import { Nil } from "../util.d.ts";

/** Check whether x is null or undefined */
export const nil = (x: unknown): x is Nil => x == null;

/** Check whether x is a string */
export const string = (x: unknown): x is string => typeof x === "string";

/** Check whether x is a number */
export const number = (x: unknown): x is number => typeof x === "number";

/** Check whether x is a bigint */
export const bigint = (x: unknown): x is bigint => typeof x === "bigint";

/** Check whether x is a boolean */
export const boolean = (x: unknown): x is boolean => x === true || x === false;

/** Check whether x is a symbol */
export const symbol = (x: unknown): x is symbol => typeof x === "symbol";

/** Check whether x is null */
export const nul = (x: unknown): x is null => x === null;

/** Check whether x is undefined */
export const undef = (x: unknown): x is undefined => x === undefined;
