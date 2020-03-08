declare type Predicate = (...x: any) => boolean;
declare type AnyConstructor = new (...args: any) => any;
declare type ObjWithStrTag<U extends string> = {
    [Symbol.toStringTag]: U;
    [k: string]: any;
};
declare type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;
declare type NativeTypes = {
    string: string;
    number: number;
    boolean: boolean;
    null: null;
    undefined: undefined;
    object: object;
    function: Function;
    symbol: symbol;
    bigint: bigint;
};
declare const _default: {
    /** Check whether x satisfies at least one of the predicates */
    sum: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x satisfies at least one of the predicates */
    union: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x is a tuple of type defined by fs */
    tuple: (fs: Predicate[]) => (xs: any[]) => boolean;
    /** Check whether x satisfies predicate, or is nil */
    optional: <T extends Predicate>(f: T) => (x: any) => x is GuardedType<T> | null | undefined;
    /** Checks whether x does not satisfy the predicate */
    not: (f: Predicate) => (x: any) => boolean;
    /** Check whether x satisfies at least one of the predicates */
    or: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x satisfies all predicates */
    and: (fs: Predicate[]) => (x: any) => boolean;
    /** Check whether x is a product of types defined by fs */
    product: (fs: Predicate[]) => (xs: any[]) => boolean;
    /** Check whether x satisfies predicate, or is nil */
    maybe: <T extends Predicate>(f: T) => (x: any) => x is GuardedType<T> | null | undefined;
    /** Check whether x satisfies either of two types */
    either: <T_1 extends Predicate, U extends Predicate>(f: T_1, g: U) => (x: any) => x is GuardedType<T_1> | GuardedType<U>;
    /** Check whether x satisfies a base type and a refinement */
    refinement: <T_2 extends Predicate, U_1 extends Predicate>(f: T_2, g: U_1) => (x: any) => x is GuardedType<T_2> & GuardedType<U_1>;
    /** Check whether all elements of x satisfy predicate */
    Array: <T_3 extends Predicate>(f: T_3) => (xs: any[]) => xs is GuardedType<T_3>[];
    /** Check the structure of an object to match a given predicate */
    Struct: <T_4 extends string, U_2 extends Predicate>(struct: Record<T_4, U_2>) => (x: any) => x is Record<T_4, any>;
    /** Check whether x is an instanceof X */
    is: <T_5 extends AnyConstructor>(X: T_5) => (x: any) => x is InstanceType<T_5>;
    /** Check whether x is of type name */
    type: <T_6 extends "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null">(name: T_6) => (x: any) => x is NativeTypes[T_6];
    /** Check whether x has a [Symbol.toStringTag] of type */
    stringTag: <T_7 extends string>(type: T_7) => (x: any) => x is ObjWithStrTag<T_7>;
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
    object: (x: any) => x is object;
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