/** Pass a type parameter and runtype will trust the type you think x is */
export const own = <T>(x: any): x is T => true;

/** Pass a type parameter and runtype will trust the type you think x is. Alias to `own` */
export const as = own;
