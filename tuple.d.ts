/**
 * Add a member to the start of a tuple
 */
export type Unshift<TailT extends any[], FrontT> = ((
	front: FrontT,
	...rest: TailT
) => any) extends (...tuple: infer TupleT) => any
	? TupleT
	: never;

export type IsFinite<Tuple extends any[], Finite, Infinite> = {
	empty: Finite;
	nonEmpty: ((..._: Tuple) => any) extends (_: infer First, ..._1: infer Rest) => any
		? IsFinite<Rest, Finite, Infinite>
		: never;
	infinite: Infinite;
}[Tuple extends []
	? "empty"
	: Tuple extends (infer Element)[]
	? Element[] extends Tuple
		? "infinite"
		: "nonEmpty"
	: never];

type Tail<T extends any[]> = ((...args: T) => any) extends (f: any, ...r: infer R) => any ? R : [];

type Last<T extends any[]> = {
	last: T[0];
	continue: Last<Tail<T>>;
}[T[1] extends undefined ? "last" : "continue"];

type Reverse<T extends any[], Accumulator extends any[] = []> = {
	done: Accumulator;
	continue: ((...x: T) => any) extends (y: infer First, ...ys: infer Next) => any
		? Reverse<Next, Unshift<Accumulator, First>>
		: never;
}[T extends [any, ...any[]] ? "continue" : "done"];

type Init<T extends any[]> = Reverse<Tail<Reverse<T>>>;

export type Concat<Left extends any[], Right extends any[]> = {
	emptyLeft: Right;
	singleLeft: Left extends [infer SoleElement] ? Unshift<Right, SoleElement> : never;
	multiLeft: Concat<Init<Left>, Unshift<Right, Last<Left>>>;
	infiniteLeft: never;
}[Left extends []
	? "emptyLeft"
	: Left extends [any]
	? "singleLeft"
	: IsFinite<Left, "multiLeft", "infiniteLeft">];
