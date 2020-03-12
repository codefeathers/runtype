export declare type Nil = null | undefined;
export declare type AnyConstructor = new (...args: any) => any;
export declare type ObjWithStrTag<U extends string> = {
    [Symbol.toStringTag]: U;
    [k: string]: any;
};
export declare type Predicate = (x: any) => boolean;
export declare type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;
export declare type PredicatesToGuards<T> = {
    [K in keyof T]: GuardedType<T[K]>;
};
export declare type AnyStruct = {
    [k in string | number | symbol]: Predicate | AnyStruct;
};
export declare type GuardedStruct<Struct> = Struct extends (...x: any[]) => any ? GuardedType<Struct> : {
    [K in keyof Struct]: GuardedStruct<Struct[K]>;
};
export declare type Unshift<TailT extends any[], FrontT> = ((front: FrontT, ...rest: TailT) => any) extends (...tuple: infer TupleT) => any ? TupleT : never;
export declare type Tuple<ElementT, LengthT extends number, OutputT extends any[] = []> = {
    0: OutputT;
    1: Tuple<ElementT, LengthT, Unshift<OutputT, ElementT>>;
}[OutputT["length"] extends LengthT ? 0 : 1];
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
//# sourceMappingURL=util.d.ts.map