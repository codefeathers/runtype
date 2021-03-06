import { AnyConstructor, GuardedType, UnionToIntersection, GuardedStruct, ObjWithStrTag, AnyStruct, Predicate, PredicatesToGuards } from "../util";
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
interface Literal {
    <T extends string>(y: T): (x: any) => x is T;
    <T extends number>(y: T): (x: any) => x is T;
    <T extends boolean>(y: T): (x: any) => x is T;
    <T extends object>(y: T): (x: any) => x is T;
    <T extends bigint>(y: T): (x: any) => x is T;
}
declare type LiteralTypes = string | number | boolean | object | bigint;
declare const _default: {
    /**
     * Takes a Predicate and Struct, x is validated against the predicate's
     * type at compile time, and validated against both at runtime
     *
     * Similar to refinement, but with a compile-time check
     * and bare object as second param
     */
    Extends: <T extends Predicate, Struct extends Partial<{ [K in keyof GuardedType<T, unknown>]: import("../util").StructGuardValue<GuardedType<T, unknown>[K]>; }> & AnyStruct>(f: T, struct: Struct) => <X extends GuardedType<T, unknown>>(x: X) => x is X & GuardedStruct<Struct>;
    /** Check whether object has property; object must be clearly typed ahead of time */
    has: <O extends {
        [k: string]: any;
    }>(o: O) => (x: any) => x is keyof O;
    /** Check whether x satisfies at least one of the predicates */
    sum: <Predicates extends Predicate[], GuardUnion extends PredicatesToGuards<Predicates>[number]>(fs: Predicates) => (x: any) => x is GuardUnion;
    /** Check whether x satisfies at least one of the predicates */
    union: <Predicates extends Predicate[], GuardUnion extends PredicatesToGuards<Predicates>[number]>(fs: Predicates) => (x: any) => x is GuardUnion;
    /** Check whether x is a tuple of type defined by fs */
    tuple: <Predicates_1 extends [Predicate] | [Predicate, Predicate] | [Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate], GuardTuple extends PredicatesToGuards<Predicates_1>>(fs: Predicates_1) => (xs: any) => xs is GuardTuple;
    /** Check whether x satisfies predicate, or is nil */
    optional: <T_1 extends Predicate>(f: T_1) => (x: any) => x is GuardedType<T_1, unknown> | undefined;
    /** Checks whether x does not satisfy the predicate
     * WARNING: Type guards will fail with not. Negated types are not supported in TS!
     * See: Negated types https://github.com/Microsoft/TypeScript/pull/29317 */
    not: <T_2 extends Predicate>(f: T_2) => (x: any) => x is Exclude<any, GuardedType<T_2, unknown>>;
    /** Exclude type represented by g from type represented by f */
    exclude: <T_3 extends Predicate, U extends Predicate>(f: T_3, g: U) => (x: any) => x is Exclude<GuardedType<T_3, unknown>, GuardedType<U, unknown>>;
    /** Check whether x satisfies all predicates */
    and: <Predicates_2 extends Predicate[], GuardUnion_1 extends PredicatesToGuards<Predicates_2>[number]>(fs: Predicates_2) => (x: any) => x is UnionToIntersection<GuardUnion_1>;
    /** Check whether x satisfies a base type and a refinement */
    refinement: <T_4 extends Predicate, U_1 extends Predicate>(f: T_4, g: U_1) => (x: any) => x is GuardedType<T_4, unknown> & GuardedType<U_1, unknown>;
    /** Check whether x satisfies at least one of the predicates */
    or: <Predicates extends Predicate[], GuardUnion extends PredicatesToGuards<Predicates>[number]>(fs: Predicates) => (x: any) => x is GuardUnion;
    /** Check whether x satisfies either of two types */
    either: <T_5 extends Predicate, U_2 extends Predicate>(f: T_5, g: U_2) => (x: any) => x is GuardedType<T_5, unknown> | GuardedType<U_2, unknown>;
    /** Check whether x satisfies predicate, or is undefined */
    maybe: <T_1 extends Predicate>(f: T_1) => (x: any) => x is GuardedType<T_1, unknown> | undefined;
    /** Check whether x satisfies predicate, or is null */
    nullable: <T_6 extends Predicate>(f: T_6) => (x: any) => x is GuardedType<T_6, unknown> | null;
    /** Check whether x satisfies predicate, or is nil */
    nilable: <T_7 extends Predicate>(f: T_7) => (x: any) => x is GuardedType<T_7, unknown> | null | undefined;
    /** check whether x satisfies one of the given literal types */
    oneOf: <Y extends LiteralTypes, Ys extends Y[]>(ys: Y[]) => (x: any) => x is Ys[number];
    /** Check whether x is a product type defined by fs */
    product: <Predicates_1 extends [Predicate] | [Predicate, Predicate] | [Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate] | [Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate, Predicate], GuardTuple extends PredicatesToGuards<Predicates_1>>(fs: Predicates_1) => (xs: any) => xs is GuardTuple;
    /** Check whether all elements of x satisfy predicate */
    Array: <T_8 extends Predicate>(f: T_8) => (xs: any[]) => xs is GuardedType<T_8, unknown>[];
    /** Check the structure of an object to match a given predicate */
    Struct: <Struct_1 extends AnyStruct>(struct: Struct_1) => (x: any) => x is GuardedStruct<Struct_1>;
    /** Literal equality of string, number, boolean, or object */
    literal: Literal;
    /** Literal equality of string, number, boolean, or object */
    equals: Literal;
    /** Check whether x is an instanceof X */
    is: <T_9 extends AnyConstructor>(X: T_9) => (x: any) => x is InstanceType<T_9>;
    /** Check whether x is of type `name`, which is a possible typeof string, or "null" */
    type: <T_10 extends "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null">(name: T_10) => (x: any) => x is NativeTypes[T_10];
    /** Check whether x has a [Symbol.toStringTag] value equal to `name` */
    stringTag: <T_11 extends string>(name: T_11) => (x: any) => x is ObjWithStrTag<T_11>;
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
    any: <U_3>(x: U_3) => x is U_3;
    /** Always pass */
    ignore: <U_3>(x: U_3) => x is U_3;
    /** Always pass */
    T: <U_3>(x: U_3) => x is U_3;
    /** Always fail */
    F: (x: any) => x is never;
    /** Always fail */
    fail: (x: any) => x is never;
};
export default _default;
export declare const unsafe: {
    /** Pass a type parameter and runtype will trust the type you think it is */
    as: <T>(x: any) => x is T;
    /** Pass a type parameter and runtype will trust the type you think x is */
    own: <T>(x: any) => x is T;
};
//# sourceMappingURL=index.d.ts.map