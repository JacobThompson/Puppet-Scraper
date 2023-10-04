const Options = require('../main/Options.js');

test("Test parseArgv", () => {
	expect(Options.parseArgv(["node.js", "Tests.js", "--one", "--two"])).toStrictEqual({one: true, two: true});
});
