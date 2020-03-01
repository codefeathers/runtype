const test = require("ava");

const { r } = require("../dist");

test("T", t => {
	const res = r.T();
	t.is(res, true);
});
