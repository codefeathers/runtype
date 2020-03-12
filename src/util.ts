export type Nil = null | undefined;
export type AnyConstructor = new (...args: any) => any;
export type ObjWithStrTag<U extends string> = { [Symbol.toStringTag]: U; [k: string]: any };

export type Predicate = (x: any) => boolean;

export type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;
export type PredicatesToGuards<T> = { [K in keyof T]: GuardedType<T[K]> };

export type AnyStruct = {
	[k in string | number | symbol]: Predicate | AnyStruct;
};

export type GuardedStruct<Struct> = Struct extends (...x: any[]) => any
	? GuardedType<Struct>
	: {
			[K in keyof Struct]: GuardedStruct<Struct[K]>;
	  };

export type Unshift<TailT extends any[], FrontT> = ((
	front: FrontT,
	...rest: TailT
) => any) extends (...tuple: infer TupleT) => any
	? TupleT
	: never;

export type Tuple<ElementT, LengthT extends number, OutputT extends any[] = []> = {
	0: OutputT;
	1: Tuple<ElementT, LengthT, Unshift<OutputT, ElementT>>;
}[OutputT["length"] extends LengthT ? 0 : 1];

// How does this work? Blessed if I knew
// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
export type UnionToIntersection<U> = (U extends any
	? (k: U) => void
	: never) extends (k: infer I) => void
	? I
	: never;
