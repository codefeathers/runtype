"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const always = {
    /// ----- Always conditions ----- ////
    /** Always pass */
    any: () => true,
    /** Always pass */
    ignore: () => true,
    /** Always pass */
    T: () => true,
    /** Always fail */
    F: () => false,
};
const primitives = {
    /// ----- Primitives ----- ////
    /** Check whether x is null or undefined */
    nil: (x) => x == null,
    /** Check whether x is null */
    null: (x) => x === null,
    /** Check whether x is undefined */
    undefined: (x) => x === undefined,
    /** Check whether x is a string */
    string: (x) => typeof x === "string",
    /** Check whether x is a number */
    number: (x) => typeof x === "number",
    /** Check whether x is a boolean */
    bool: (x) => x === true || x === false,
    /** Check whether x is a symbol */
    symbol: (x) => typeof x === "symbol",
    /** Check whether x is an object */
    object: (x) => !!x && typeof x === "object",
};
const runtime = {
    /// ----- Runtime type related ----- ////
    /** Check whether x is an instanceof X */
    is: (X) => (x) => {
        try {
            return x.constructor === X || x instanceof X;
        }
        catch {
            return false;
        }
    },
    /** Check whether x is of type name */
    type: (name) => (x) => (name === "null" && x === null) || typeof x === name,
    /** Check whether x has a [Symbol.toStringTag] of type */
    stringTag: (type) => (x) => {
        try {
            return x[Symbol.toStringTag] === type;
        }
        catch {
            return false;
        }
    },
};
const combiners = {
    /// ----- Combiners ----- ////
    /** Checks whether x does not satisfy the predicate */
    not: (f) => (x) => !f(x),
    //TODO: Negated types https://github.com/Microsoft/TypeScript/pull/29317
    /** Check whether x satisfies at least one of the predicates */
    or: (fs) => (x) => {
        //TODO: variadic, couldn't be type-guarded yet
        try {
            return fs.reduce((last, f) => last || f(x), false);
        }
        catch {
            return false;
        }
    },
    /** Check whether x satisfies all predicates */
    and: (fs) => (x) => {
        //TODO: variadic, couldn't be type-guarded yet
        try {
            return fs.reduce((last, f) => last && f(x), true);
        }
        catch {
            return false;
        }
    },
    /** Check whether x is a product of types defined by fs */
    product: (fs) => (xs) => {
        //TODO: variadic, couldn't be type-guarded yet
        try {
            return fs.every((f, i) => f(xs[i]));
        }
        catch {
            return false;
        }
    },
    /** Check whether x satisfies either of two types */
    either: (f, g) => (x) => !!(f && g) && (f(x) || g(x)),
    /** Check whether x satisfies predicate, or is nil */
    maybe: (f) => (x) => combiners.either(f, primitives.nil)(x),
    /** Check whether x satisfies a base type and a refinement */
    refinement: (f, g) => (x) => combiners.and([f, g])(x),
    /// ----- Array and Struct ----- ////
    /** Check whether all elements of x satisfy predicate */
    Array: (f) => (xs) => {
        try {
            return xs.every(x => f(x));
        }
        catch {
            return false;
        }
    },
    /** Check the structure of an object to match a given predicate */
    Struct: (struct) => (x) => {
        try {
            for (const key in struct) {
                const pred = (struct[key] && typeof struct[key] === "object"
                    ? // Assert because TypeScript does not understand that this narrows out Predicate
                        combiners.Struct(struct[key])
                    : // Or that this leaves us with Predicate
                        struct[key]);
                if (!pred(x[key]))
                    return false;
            }
            return true;
        }
        catch {
            return false;
        }
    },
};
const aliases = {
    /// ----- Aliases ----- ////
    /** Check whether x satisfies at least one of the predicates */
    sum: combiners.or,
    /** Check whether x satisfies at least one of the predicates */
    union: combiners.or,
    /** Check whether x is a tuple of type defined by fs */
    tuple: combiners.product,
    /** Check whether x satisfies predicate, or is nil */
    optional: combiners.maybe,
};
exports.default = {
    ...always,
    ...primitives,
    ...runtime,
    ...combiners,
    ...aliases,
};
//# sourceMappingURL=index.js.map