const Options = require('../main/Options.js');

test("Test parseArgv", () => {
	expect(Options.parseArgv(["node.js", "Tests.js", "--one", "--two"])).toStrictEqual({one: true, two: true});
	expect(Options.parseArgv(["--hey", "--howdy", "--url=https://google.com", "--red=true"])).toStrictEqual({url: "https://google.com", red: "true"});
	expect(Options.parseArgv([])).toStrictEqual({});
});

test("Test constructor", () => {
	const test1 = new Options(["nodejs", "tests.js", "--txt", "--pdf"]);
	expect(test1.argList).toStrictEqual({text: true, pdf: true});

	const test2 = new Options([1, 2, '--badargument', '--txt']);
	expect(test2.argList).toStrictEqual({text: true});

	const test3 = new Options(["node", "tests", '--titles']);
	expect(test3.argList).toStrictEqual({titles: true});

	const test4 = new Options(['node', 'tests', 4]);
	expect(test4.argList).toStrictEqual({});

	expect(() => {
		const test5 = new Options(3);
	}).toThrow();

	const test5 = new Options(["node", "tests", '--metas']);
	expect(test5.argList).toStrictEqual({metaDescriptions: true});

	const test6 = new Options(["node", "tests", '--links']);
	expect(test6.argList).toStrictEqual({links: true});

	const test7 = new Options(["node", "tests", '--overwrite']);
	expect(test7.argList).toStrictEqual({overwrite: true});

	const test8 = new Options(["node", "tests", '--pdf']);
	expect(test8.argList).toStrictEqual({pdf: true});

	const test9 = new Options(["node", "tests", '--url=https://google.com']);
	expect(test9.argList).toStrictEqual({url: 'https://google.com'});
});
