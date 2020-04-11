import { Nil } from "../../util";

/** Check whether x is null */
export const Null = (x: any): x is null => x === null;

/** Check whether x is undefined */
export const Undefined = (x: any): x is undefined => x === undefined;

/** Check whether x is null or undefined */
export const nil = (x: any): x is Nil => x == null;

/** Check whether x is a string */
export const string = (x: any): x is string => typeof x === "string";

/** Check whether x is a number */
export const number = (x: any): x is number => typeof x === "number";

/** Check whether x is a boolean */
export const bool = (x: any): x is boolean => x === true || x === false;

/** Check whether x is a symbol */
export const symbol = (x: any): x is symbol => typeof x === "symbol";

/** Check whether x is an object */
export const object = (x: any): x is object => !!x && typeof x === "object";
