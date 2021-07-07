import { Predicate, GuardedType } from "../util.d.ts";

/** Checks whether x does not satisfy the predicate.
 * WARNING! Type guards will fail with not. Negated types are not supported in TS!
 * See: Negated types https://github.com/Microsoft/TypeScript/pull/29317 */
export const not =
	<T extends Predicate = Predicate>(f: T) =>
	(x: any): x is unknown =>
		!f(x);
//TODO: Negated type

/** Pass a type parameter and an unguarded predicate as f;
 * runtype will trust the type of x as given, provided your predicate returns true */
export const as =
	<T, Pred extends (x: T) => boolean = (x: T) => boolean>(f: Pred) =>
	(x: any): x is T extends never ? GuardedType<Pred, never> : T =>
		f(x);
