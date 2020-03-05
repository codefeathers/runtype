declare type Predicate = (...x: any) => boolean;
declare type types = "string" | "number" | "symbol" | "boolean" | "object" | "undefined";
declare const _default: {
    /** Check whether x satisfies at least one of the predicates */
    sum: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x satisfies at least one of the predicates */
    union: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x is a tuple of type defined by fs */
    tuple: (fs: Predicate[]) => (xs: any[]) => boolean;
    /** Check whether x satisfies predicate, or is nil */
    optional: (f: Predicate) => (x: any) => boolean;
    /** Checks whether x does not satisfy the predicate */
    not: (f: Predicate) => (x: any) => boolean;
    /** Check whether x satisfies at least one of the predicates */
    or: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x satisfies all predicates */
    and: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x satisfies predicate, or is nil */
    maybe: (f: Predicate) => (x: any) => boolean;
    /** Check whether x satisfies a base type and a refinement */
    refinement: (f: Predicate, g: Predicate) => (x: any) => boolean;
    /** Check whether x is a product of types defined by fs */
    product: (fs: Predicate[]) => (xs: any[]) => boolean;
    /** Check whether all elements of x satisfy predicate */
    Array: (f: Predicate) => (xs: any[]) => boolean;
    /** Check the structure of an object to match a given predicate */
    Struct: (struct: Record<string, Predicate>) => (x: any) => boolean;
    /** Check whether x is an instanceof X */
    is: (X: new (...args: any) => any) => (x: any) => boolean | undefined;
    /** Check whether x is of type name */
    type: (name: string) => (x: any) => boolean;
    /** Check whether x has a [Symbol.toStringTag] of type */
    stringTag: (type: types) => (x: any) => boolean | undefined;
    /** Check whether x is null or undefined */
    nil: (x: any) => x is null | undefined;
    /** Check whether x is null */
    null: (x: any) => x is null;
    /** Check whether x is undefined */
    undefined: (x: any) => x is undefined;
    /** Check whether x is a string */
    string: (x: any) => x is string;
    /** Check whether x is a number */
    number: (x: any) => x is number;
    /** Check whether x is a boolean */
    bool: (x: any) => x is boolean;
    /** Check whether x is a symbol */
    symbol: (x: any) => x is symbol;
    /** Check whether x is an object */
    object: (x: any) => boolean;
    /** Always pass */
    any: () => boolean;
    /** Always pass */
    ignore: () => boolean;
    /** Always pass */
    T: () => boolean;
    /** Always fail */
    F: () => boolean;
};
export default _default;
//# sourceMappingURL=index.d.ts.map