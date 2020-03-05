"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryCatch = (f) => (x) => {
    try {
        if (f(x)) {
            return true;
        }
    }
    catch {
        return false;
    }
};
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
    is: (X) => tryCatch((x) => x.constructor === X || x instanceof X),
    /** Check whether x is of type name */
    type: (name) => (x) => (name === "null" && x === null) || typeof x === name,
    /** Check whether x has a [Symbol.toStringTag] of type */
    stringTag: (type) => tryCatch((x) => x[Symbol.toStringTag] === type),
};
const combiners = {
    /// ----- Combiners ----- ////
    /** Checks whether x does not satisfy the predicate */
    not: (f) => (x) => !f(x),
    /** Check whether x satisfies at least one of the predicates */
    or: (fs) => (x) => fs.reduce((last, f) => last || f(x), false),
    /** Check whether x satisfies all predicates */
    and: (fs) => (x) => fs.reduce((last, f) => last && f(x), true),
    /** Check whether x satisfies predicate, or is nil */
    maybe: (f) => (x) => combiners.or([f, primitives.nil])(x),
    /** Check whether x satisfies a base type and a refinement */
    refinement: (f, g) => (x) => combiners.and([f, g])(x),
    /** Check whether x is a product of types defined by fs */
    product: (fs) => (xs) => fs.every((f, i) => f(xs[i])),
    /// ----- Array and Struct ----- ////
    /** Check whether all elements of x satisfy predicate */
    Array: (f) => (xs) => xs.every(x => f(x)),
    /** Check the structure of an object to match a given predicate */
    Struct: (struct) => (x) => {
        for (const key in struct) {
            const pred = struct[key];
            if (!pred(x[key]))
                return false;
        }
        return true;
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