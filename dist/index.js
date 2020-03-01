"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _r = {
    T: () => true,
    F: () => false,
    any: () => true,
    nil: (x) => x == null,
    null: (x) => x === null,
    undefined: (x) => x === undefined,
    string: (x) => typeof x === "string",
    number: (x) => typeof x === "number",
    bool: (x) => x === true || x === false,
    symbol: (x) => typeof x === "symbol",
    object: (x) => x && typeof x === "object",
    is: (X, x) => x && _r.object(X) && (x.constructor === X || x instanceof X),
    type: (name, x) => typeof x === name,
    toStringTag: (type, x) => x && x[Symbol.toStringTag] === type,
    or: (fs, x) => fs.reduce((last, f) => last || f(x), false),
    and: (fs, x) => fs.reduce((last, f) => last && f(x), true),
    maybe: (f, x) => _r.or([f, _r.nil], x),
    refinement: (f, g, x) => _r.and([f, g], x),
    Array: (f, xs) => xs.every(x => f(x)),
};
exports.r = {
    ..._r,
    sum: _r.or,
    product: _r.and,
    optional: _r.maybe,
    P: (f) => (...args) => (x) => f(...args, x),
    Struct: (struct, x) => {
        for (const key in struct) {
            const pred = struct[key];
            if (!pred(x[key]))
                return false;
        }
        return true;
    },
};
//# sourceMappingURL=index.js.map