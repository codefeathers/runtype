/** Always pass */
export const any = <U>(x: U): x is U => true;

/** Always fail */
export const never = (x: any): x is never => false;
