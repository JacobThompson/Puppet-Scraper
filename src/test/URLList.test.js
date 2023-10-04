const URLList = require('../main/URLList.js');

test("Testing URLList.isInDomain()", () => {
	expect(URLList.isInDomain("https://google.com/help/products", "https://google.com")).toBe(true);
	expect(URLList.isInDomain("https://www.facebook.com/?ref=4", "https://www.facebook.com")).toBe(true);
	expect(URLList.isInDomain("http://google.com", "https://google.com")).toBe(true);
	expect(URLList.isInDomain("http://myspace.org", "https://myspace.com")).toBe(false);
	expect(URLList.isInDomain("myspace.org/login/users", "https://myspace.org")).toBe(true);
	expect(URLList.isInDomain("myspace.org/my-cool-myspace-page", "https://google.com")).toBe(false);
	expect(URLList.isInDomain("x.com", "https://x.com")).toBe(true);
	expect(URLList.isInDomain(".org", "https://myspace.com")).toBe(false);
	expect(URLList.isInDomain("", "https://myspace.com")).toBe(false);
});

test("Testing URLList.isValidURI()", () => {
	expect(URLList.isValidURI("")).toBe(false);
	expect(URLList.isValidURI("myspace.com")).toBe(true);
	expect(URLList.isValidURI("https://www.myspace.com")).toBe(true);
	expect(URLList.isValidURI("http://myspace.com")).toBe(true);
	expect(URLList.isValidURI("https://myspace.com")).toBe(true);
	expect(URLList.isValidURI("https://subdomain.mywebsite.com/about/careers")).toBe(true);
	expect(URLList.isValidURI("https://subdomain.mywebsite.com/about/careers^")).toBe(false);
	expect(URLList.isValidURI("https://mywebsite.store/about/careers")).toBe(true);
	expect(URLList.isValidURI("Flabbergasting!")).toBe(false);
	expect(URLList.isValidURI(42)).toBe(false);
	expect(URLList.isValidURI(new RegExp(''))).toBe(false);
});

//test("Testing URLList.removeInvalidURLs()", () => {
//	expect(URLList.removeInvalidURLs(["https://google.com", ""]), ["https://google.com"]);
//	expect(URLList.removeInvalidURLs([""]), []);
//	expect(URLList.removeInvalidURLs([1]), []);
//	expect(URLList.removeInvalidURLs(["https://reddit.com/about?a=4", "tree", "banana", "google.com"]), ["https://reddit.com/about?a=4", "google.com"]);
//	expect(URLList.removeInvalidURLs([Array.from([]), new Set(), new Object()]), []);
//	expect(URLList.removeInvalidURLs([5132, "https:///"]), []);
//
//});
//
//test("Testing URLList constructor", () => {
//	//Test string argument.
//	const expect1 = new URLList("https://google.com");
//
//	expect(test1.getURLList, ["https://google.com"]);
//
//	//Test normal functionality.
//	const test2 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);
//
//	expect(test2.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);
//
//	//Test internal only functionality.
//	const test3 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"], "facebook.com", {internalOnly: true});
//
//	expect(test3.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact"]);
//
//	const test4 = new URLList(['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/']);
//
//	expect(test4.getURLList, ['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/']);
//
//	//Test invalid URIs
//	const test5 = new URLList(['', "https://reddit.com", "44", 1, "google.com"]);
//
//	expect(test5.getURLList, ["https://reddit.com", "google.com"]);
//
//	//Test duplicate entry removal.
//	const test6 = new URLList(['google.com', 'google.com']);
//
//	expect(test6.getURLList, ['google.com']);
//
//	//Test a large input
//	const test7 = new URLList(['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
//		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
//		'google.com/careers', 'google.com/careers/california', 'https://google.com/?expect=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
//		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com']);
//
//	test(test7.getURLList, ['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
//		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
//		'google.com/careers', 'google.com/careers/california', 'https://google.com/?expect=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
//		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com']);
//});
//
//test("Testing URLList.addURLToList()", () => {
//	//Test adding URL as string.
//	const test1 = new URLList(['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/']);
//
//	test1.addURLToList("reddit.com/r/horses");
//
//	expect(test1.getURLList, ['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/', 'reddit.com/r/horses']);
//
//	//Test adding multiple times.
//	const test2 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);
//
//	test2.addURLToList("google.com");
//	test2.addURLToList("https://yahoo.com/about/");
//
//	expect(test2.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com", "google.com", "https://yahoo.com/about/"]);
//
//	//Test adding via array.
//	const test3 = new URLList("https://google.com");
//
//	test3.addURLToList(["https://google.com/about/", "https://google.com/contact/"]);
//
//	expect(test3.getURLList, ["https://google.com", "https://google.com/about/", "https://google.com/contact/"]);
//
//	//Test adding via array multiple times and invalid URLs.
//	const test4 = new URLList(['', "https://reddit.com", "44", 1, "google.com"]);
//
//	test4.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com']);
//	test4.addURLToList(['', 'https://mobile.reddit.com/']);
//
//	expect(test4.getURLList, ["https://reddit.com", "google.com", 'https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com', 'https://mobile.reddit.com/']);
//	
//	//Test adding URL as string with internalOnly on.
//	const test5 = new URLList(['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
//		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
//		'google.com/careers', 'google.com/careers/california', 'https://google.com/?test=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
//		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com'], "https://google.com", {internalOnly: true});
//
//	expect5.addURLToList("yahoo.com");
//
//	expect(test5.getURLList, ['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
//		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
//		'google.com/careers', 'google.com/careers/california', 'https://google.com/?test=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
//		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com']);
//	
//	
//	//Test adding URL as string multiple times with internalOnly on.
//	const test6 = new URLList(['google.com', 'google.com'], "https://google.com", {internalOnly: true});
//
//	test6.addURLToList("google.com");
//	test6.addURLToList("https://google.com/about");
//	test6.addURLToList("https://google.com/contact");
//	test6.addURLToList("https://yahoo.com/contact");
//
//	expect(test6.getURLList, ['google.com', "https://google.com/about", "https://google.com/contact"]);
//	
//	//Test adding URL via array with internalOnly on.
//	const test7 = new URLList(['', "https://reddit.com", "44", 1, "google.com"], "google.com", {internalOnly: true});
//
//	test7.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com']);
//
//	expect(test7.getURLList, ["google.com", 'https://google.com/about']);
//		
//	
//	//test adding via array multiple times with internalOnly on.
//	const test8 = new URLList(['', "https://reddit.com", "44", 1, "google.com"], "google.com", {internalOnly: true});
//
//	test8.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com']);
//	test8.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com', "google.com/very-cool-blog"]);
//
//	expect(test8.getURLList, ["google.com", 'https://google.com/about', "google.com/very-cool-blog"]);
//	
//});
//
//test("Test URLList.removeURLFromList", () => {
//	const test1 = new URLList(['', "https://reddit.com", "44", 1, "google.com"], "google.com", {internalOnly: true});
//
//	assert(test1.removeURLFromList("google.com"));
//	expect(test1.getURLList, []);
//
//	const test2 = new URLList(["https://google.com", "https://google.com/about/", "https://google.com/contact/"]);
//
//	assert(test2.removeURLFromList("https://google.com/contact/"));
//	assert(test2.removeURLFromList("https://google.com/about/"));
//	expect(test2.removeURLFromList("google.com"), false);
//
//	expect(test2.getURLList, ["https://google.com"]);
//
//});
