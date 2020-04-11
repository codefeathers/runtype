export const T = <U>(x: U): x is U => true;
export const F = (x: any): x is never => false;

export const any = T;
export const ignore = T;
export const never = F;
