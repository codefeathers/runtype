/**
 * null or undefined
 */
export type Nil = null | undefined;

/**
 * Types that can be expressed as a literal
 */
type LiteralTypes = string | number | boolean | object | bigint;

/**
 * All native types in JavaScript
 */
type NativeTypes = {
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

/**
 * A generic Class or constructor
 */
export type AnyConstructor = new (...args: any) => any;

/**
 * A base Predicate type
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

/**
 * Map a type of predicates to the guarded types represented by them
 */
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

/**
 * A trick to unroll complex computed types and reveal the resolved type
 */
export type MappedId<T> = {} & { [P in keyof T]: T[P] };

/**
 * Make props that can be undefined optional
 */
export type UndefinedOptional<T> = MappedId<Defined<T> & Partial<Undefinables<T>>>;

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

// Undocumented and unexported because doesn't seem useful
// outside of CreateStructGuard
type StructGuardValue<T> = T extends {}
	?
			| ((x: any) => x is T) // value can be a predicate guarding T
			| ((x: any) => x is Partial<T> & object) // value can be a predicate guarding a few props of T and props not in T (extends)
			| (Partial<CreateStructGuard<T>> & AnyStruct) // value can be an object literal with type guards for a few or all props of T and other predicate props
	: (x: any) => x is T;

/**
 * Take an object of types and return
 * an object of corresponding type guards
 */
export type CreateStructGuard<T> = {} & {
	[K in keyof T]: StructGuardValue<T[K]>;
};

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
