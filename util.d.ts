/**
 * null or undefined
 */
export type Nil = null | undefined;

/**
 * A generic Class or constructor
 */
export type AnyConstructor = new (...args: any) => any;

/**
 * A generic Predicate type
 */
export type Predicate = (x: any) => boolean;

/**
 * A generic Struct interface
 */
export type AnyStruct = {
	[k in string | number | symbol]: Predicate | AnyStruct;
};

/**
 * An object type with a given stringTag
 */
export type ObjWithStrTag<U extends string> = {
	[k in string | number | symbol]: any;
} & { [Symbol.toStringTag]: U };

/**
 * Extract the guarded type from a type guard
 */
export type GuardedType<T, Default = unknown> = T extends (x: any) => x is infer T ? T : Default;
export type PredicatesToGuards<T> = { [K in keyof T]: GuardedType<T[K]> };

/**
 * Get props that can be assigned U
 */
export type PickPropType<T, U> = {
	[K in keyof T]: U extends T[K] ? K : never;
}[keyof T];

/**
 * Get props that can be assigned undefined
 */
export type Undefinables<T> = {
	[K in PickPropType<T, undefined>]: T[K];
};

/**
 * Get props except those that can be assigned U
 */
export type ExcludePropType<T, U> = {
	[K in keyof T]: U extends T[K] ? never : K;
}[keyof T];

/**
 * Get props that cannot be assigned undefined
 */
export type Defined<T> = {
	[K in ExcludePropType<T, undefined>]: T[K];
};

type Id<T> = {} & { [P in keyof T]: T[P] };

/**
 * Make props that can be undefined optional
 */
export type UndefinedOptional<T> = Id<Defined<T> & Partial<Undefinables<T>>>;

/**
 * Take an object of predicates and return
 * an object type containing the guarded types
 */
export type GuardedStruct<Struct> = Struct extends (...x: any[]) => any
	? GuardedType<Struct>
	: UndefinedOptional<
			{
				[K in keyof Struct]: GuardedStruct<Struct[K]>;
			}
	  >;

/**
 * Add a member to the start of a tuple
 */
export type Unshift<TailT extends any[], FrontT> = ((
	front: FrontT,
	...rest: TailT
) => any) extends (...tuple: infer TupleT) => any
	? TupleT
	: never;

/**
 * Create a tuple type of arbitrary length
 */
export type Tuple<ElementT, LengthT extends number, OutputT extends any[] = []> = {
	0: OutputT;
	1: Tuple<ElementT, LengthT, Unshift<OutputT, ElementT>>;
}[OutputT["length"] extends LengthT ? 0 : 1];

/**
 * Convert a union to an intersection
 */
// How does this work? Blessed if I knew
// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;
