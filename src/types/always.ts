/** Always pass */
export const T = <U>(x: U): x is U => true;

/** Always fail */
export const F = (x: any): x is never => false;

/** Always pass */
export const any = T;

/** Always fail */
export const never = F;
