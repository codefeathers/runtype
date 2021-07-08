/** Always pass */
export const any = <U>(x: U): x is U => true;

/** Always fail */
export const never = (x: unknown): x is never => false;
