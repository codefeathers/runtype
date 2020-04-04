"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const T = () => true;
const F = () => false;
const always = {
    /// ----- Always conditions ----- ///
    /** Always pass */
    any: T,
    /** Always pass */
    ignore: T,
    /** Always pass */
    T,
    /** Always fail */
    F,
};
const primitives = {
    /// ----- Primitives ----- ///
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
const literal = (y) => (x) => x === y;
const runtime = {
    /// ----- Runtime type related ----- ////
    /** Literal equality of string, number, boolean, or object */
    literal,
    /** Literal equality of string, number, boolean, or object */
    equals: literal,
    /** Check whether x is an instanceof X */
    is: (X) => (x) => {
        try {
            return x.constructor === X || x instanceof X;
        }
        catch {
            return false;
        }
    },
    /** Check whether x is of type `name`, which is a possible typeof string, or "null" */
    type: (name) => (x) => x === null ? name === "null" : typeof x === name,
    /** Check whether x has a [Symbol.toStringTag] value equal to `name` */
    stringTag: (name) => (x) => {
        try {
            return x[Symbol.toStringTag] === name;
        }
        catch {
            return false;
        }
    },
};
const combiners = {
    /// ----- Combiners ----- ///
    /** Checks whether x does not satisfy the predicate
     * WARNING: Type guards will fail with not. Negated types are not supported in TS!
     * See: Negated types https://github.com/Microsoft/TypeScript/pull/29317 */
    not: (f) => (x) => !f(x),
    //TODO: Negated type
    /** Exclude type represented by g from type represented by f */
    exclude: (f, g) => (x) => f(x) && !g(x),
    /** Check whether x satisfies at least one of the predicates */
    or: (fs) => (x) => {
        try {
            return fs.reduce((last, f) => last || f(x), false);
        }
        catch {
            return false;
        }
    },
    /** Check whether x satisfies all predicates */
    and: (fs) => (x) => {
        try {
            return fs.reduce((last, f) => last && f(x), true);
        }
        catch {
            return false;
        }
    },
    /** Check whether x is a product type defined by fs */
    product: (fs) => (xs) => {
        //TODO: variadic, type-guard is limited from 2 to 15 Predicates
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
            // minor optimisation to ignore iterating in case of r.Array(r.any)
            if (f === T) {
                return Array.isArray(xs);
            }
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
const object = {
    /// ----- Object ----- ///
    /** Check whether object has property; object must be clearly typed ahead of time */
    has: (o) => (x) => o.hasOwnProperty(x),
};
const aliases = {
    /// ----- Aliases ----- ///
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
    ...object,
};
const unsafeBase = {
    /** Pass a type parameter and runtype will trust the type you think x is */
    own: (x) => true,
};
exports.unsafe = {
    ...unsafeBase,
    /** Pass a type parameter and runtype will trust the type you think it is */
    as: unsafeBase.own,
};
//# sourceMappingURL=index.js.map