/**
 * null or undefined
 */
export type Nil = null | undefined;

/**
 * Types that can be expressed as a literal
 */
export type LiteralTypes = Nil | string | number | bigint | boolean | symbol;

/**
 * All native types in JavaScript
 */
export type NativeTypes = {
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
 * Any function
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Any object
 */
export type AnyObject = Record<string | number | symbol, any>;

/**
 * A generic Class or constructor
 */
export type AnyConstructor = new (...args: any[]) => any;

/**
 * A generic Struct interface
 */
export type AnyStruct = {
	[k in string | number | symbol]: Predicate | AnyStruct;
};

/**
 * A base Predicate type
 */
export type Predicate = (x: any) => boolean;

/**
 * Extract the guarded type from a type guard, defaults to never.
 * Override default by passing a second type param.
 */
export type GuardedType<T, Default = unknown> =
	// -
	T extends (x: any) => x is infer T ? T : Default;

/**
 * A Predicate with defined guard
 */
export type GuardedPredicate<T> = (x: any) => x is T;

/**
 * Map a type of predicates to the guarded types represented by them
 */
export type PredicatesToGuards<T> = MappedId<
	{ [K in keyof T]: GuardedType<T[K], never> }
>;

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
export type UndefinedOptional<T> = MappedId<
	Defined<T> & Partial<Undefinables<T>>
>;

/**
 * Take an object of predicates and return
 * an object type containing the guarded types
 */
export type GuardedStruct<Struct> = Struct extends AnyFunction
	? GuardedType<Struct, never>
	: UndefinedOptional<{ [K in keyof Struct]: GuardedStruct<Struct[K]> }>;

// Undocumented and unexported because doesn't seem useful
// outside of CreateStructGuard
type StructGuardValue<T> = T extends {}
	?
			| GuardedPredicate<T>
			// value can be a predicate guarding a few props of T and props not in T (extends)
			| GuardedPredicate<Partial<T> & {}>
			| (Partial<CreateStructGuard<T>> & AnyStruct) // value can be an object literal with type guards for a few or all props of T and other predicate props
	: GuardedPredicate<T>;

/**
 * Take an object of types and return
 * an object of corresponding type guards
 */
export type CreateStructGuard<T> =
	//
	{} & { [K in keyof T]: StructGuardValue<T[K]> };

/**
 * Convert a union to an intersection
 */
export type UnionToIntersection<U> =
	// -
	(U extends any ? (k: U) => void : never) extends (k: infer I) => void
		? I
		: never;
