import { Nil } from "../../util";

/** Check whether x is null or undefined */
export const nil = (x: any): x is Nil => x == null;

/** Check whether x is a string */
export const string = (x: any): x is string => typeof x === "string";

/** Check whether x is a number */
export const number = (x: any): x is number => typeof x === "number";

/** Check whether x is a bigint */
export const bigint = (x: any): x is bigint => typeof x === "bigint";

/** Check whether x is a boolean */
export const bool = (x: any): x is boolean => x === true || x === false;

/** Check whether x is a symbol */
export const symbol = (x: any): x is symbol => typeof x === "symbol";

export const primitive = {
	/** Check whether x is null */
	null: (x: any): x is null => x === null,

	/** Check whether x is undefined */
	undefined: (x: any): x is undefined => x === undefined,

	/** Check whether x is a string */
	string,

	/** Check whether x is a number */
	number,

	/** Check whether x is a bigint */
	bigint,

	/** Check whether x is a boolean */
	bool,

	/** Check whether x is a symbol */
	symbol,
};
