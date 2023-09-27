import {assert, assertEquals} from "https://deno.land/std@0.201.0/assert/mod.ts";
import {URLList} from "../main/URLList.js";

Deno.test("Testing URLList.isInDomain()", () => {
	assertEquals(URLList.isInDomain("https://google.com/help/products", "https://google.com"), true);
	assertEquals(URLList.isInDomain("https://www.facebook.com/?ref=4", "https://www.facebook.com"), true);
	assertEquals(URLList.isInDomain("http://google.com", "https://google.com"), true);
	assertEquals(URLList.isInDomain("http://myspace.org", "https://myspace.com"), false);
	assertEquals(URLList.isInDomain("myspace.org/login/users", "https://myspace.org"), true);
	assertEquals(URLList.isInDomain("myspace.org/my-cool-myspace-page", "https://google.com"), false);
	assertEquals(URLList.isInDomain("x.com", "https://x.com"), true);
	assertEquals(URLList.isInDomain(".org", "https://myspace.com"), false);
	assertEquals(URLList.isInDomain("", "https://myspace.com"), false);
});

Deno.test("Testing URLList.isValidURI()", () => {
	assertEquals(URLList.isValidURI(""), false);
	assertEquals(URLList.isValidURI("myspace.com"), true);
	assertEquals(URLList.isValidURI("https://www.myspace.com"), true);
	assertEquals(URLList.isValidURI("http://myspace.com"), true);
	assertEquals(URLList.isValidURI("https://myspace.com"), true);
	assertEquals(URLList.isValidURI("https://subdomain.mywebsite.com/about/careers"), true);
	assertEquals(URLList.isValidURI("https://subdomain.mywebsite.com/about/careers^"), false);
	assertEquals(URLList.isValidURI("https://mywebsite.store/about/careers"), true);
	assertEquals(URLList.isValidURI("Flabbergasting!"), false);
	assertEquals(URLList.isValidURI(42), false);
	assertEquals(URLList.isValidURI(new RegExp('')), false);
});

Deno.test("Testing URLList.removeInvalidURLs()", () => {
	assertEquals(URLList.removeInvalidURLs(["https://google.com", ""]), ["https://google.com"]);
	assertEquals(URLList.removeInvalidURLs([""]), []);
	assertEquals(URLList.removeInvalidURLs([1]), []);
	assertEquals(URLList.removeInvalidURLs(["https://reddit.com/about?a=4", "tree", "banana", "google.com"]), ["https://reddit.com/about?a=4", "google.com"]);
	assertEquals(URLList.removeInvalidURLs([Array.from([]), new Set(), new Object()]), []);
	assertEquals(URLList.removeInvalidURLs([5132, "https:///"]), []);

});

Deno.test("Testing URLList constructor", () => {
	//Test string argument.
	const test1 = new URLList("https://google.com");

	assertEquals(test1.getURLList, ["https://google.com"]);

	//Test normal functionality.
	const test2 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);

	assertEquals(test2.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);

	//Test internal only functionality.
	const test3 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"], "facebook.com", {internalOnly: true});

	assertEquals(test3.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact"]);

	const test4 = new URLList(['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/']);

	assertEquals(test4.getURLList, ['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/']);

	//Test invalid URIs
	const test5 = new URLList(['', "https://reddit.com", "44", 1, "google.com"]);

	assertEquals(test5.getURLList, ["https://reddit.com", "google.com"]);

	//Test duplicate entry removal.
	const test6 = new URLList(['google.com', 'google.com']);

	assertEquals(test6.getURLList, ['google.com']);

	//Test a large input
	const test7 = new URLList(['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
		'google.com/careers', 'google.com/careers/california', 'https://google.com/?test=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com']);

	assertEquals(test7.getURLList, ['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
		'google.com/careers', 'google.com/careers/california', 'https://google.com/?test=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com']);
});

Deno.test("Testing URLList.addURLToList()", () => {
	//Test adding URL as string.
	const test1 = new URLList(['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/']);

	test1.addURLToList("reddit.com/r/horses");

	assertEquals(test1.getURLList, ['https://reddit.com', 'reddit.com', 'reddit.com/r/memes', 'reddit.com/', 'reddit.com/r/horses']);

	//Test adding multiple times.
	const test2 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);

	test2.addURLToList("google.com");
	test2.addURLToList("https://yahoo.com/about/");

	assertEquals(test2.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com", "google.com", "https://yahoo.com/about/"]);

	//Test adding via array.
	const test3 = new URLList("https://google.com");

	test3.addURLToList(["https://google.com/about/", "https://google.com/contact/"]);

	assertEquals(test3.getURLList, ["https://google.com", "https://google.com/about/", "https://google.com/contact/"]);

	//Test adding via array multiple times and invalid URLs.
	const test4 = new URLList(['', "https://reddit.com", "44", 1, "google.com"]);

	test4.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com']);
	test4.addURLToList(['', 'https://mobile.reddit.com/']);

	assertEquals(test4.getURLList, ["https://reddit.com", "google.com", 'https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com', 'https://mobile.reddit.com/']);
	
	//Test adding URL as string with internalOnly on.
	const test5 = new URLList(['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
		'google.com/careers', 'google.com/careers/california', 'https://google.com/?test=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com'], "https://google.com", {internalOnly: true});

	test5.addURLToList("yahoo.com");

	assertEquals(test5.getURLList, ['https://google.com/about', 'http://google.com/about', 'http://google.com/contact', 'https://google.com/contact-us', 'https://google.com/drive/', 'https://google.com/en-us/about-us/',
		'https://google.com/current', 'https://google.com/blog/', 'https://google.com/blog/august-23/23', 'https://www.google.com', 'google.com/my-account', 'google.com', 'google.com/en-us/what-i-think-about-google',
		'google.com/careers', 'google.com/careers/california', 'https://google.com/?test=4', 'google.com/?ab=1&c=2&d=3', 'https://google.com/?ab=1&c=2&d=3',
		'https://google.com/what-is-the-google-search-engine-2023-help-me-guide-september-why-is-this-url-so-long', 'www.google.com']);
	
	
	//Test adding URL as string multiple times with internalOnly on.
	const test6 = new URLList(['google.com', 'google.com'], "https://google.com", {internalOnly: true});

	test6.addURLToList("google.com");
	test6.addURLToList("https://google.com/about");
	test6.addURLToList("https://google.com/contact");
	test6.addURLToList("https://yahoo.com/contact");

	assertEquals(test6.getURLList, ['google.com', "https://google.com/about", "https://google.com/contact"]);
	
	//Test adding URL via array with internalOnly on.
	const test7 = new URLList(['', "https://reddit.com", "44", 1, "google.com"], "google.com", {internalOnly: true});

	test7.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com']);

	assertEquals(test7.getURLList, ["google.com", 'https://google.com/about']);
		
	
	//test adding via array multiple times with internalOnly on.
	const test8 = new URLList(['', "https://reddit.com", "44", 1, "google.com"], "google.com", {internalOnly: true});

	test8.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com']);
	test8.addURLToList(['https://google.com/about', 'https://yahoo.com', 'https://bloomberg.com', "google.com/very-cool-blog"]);

	assertEquals(test8.getURLList, ["google.com", 'https://google.com/about', "google.com/very-cool-blog"]);
	
});

Deno.test("Test URLList.removeURLFromList", () => {
	const test1 = new URLList(['', "https://reddit.com", "44", 1, "google.com"], "google.com", {internalOnly: true});

	assert(test1.removeURLFromList("google.com"));
	assertEquals(test1.getURLList, []);

	const test2 = new URLList(["https://google.com", "https://google.com/about/", "https://google.com/contact/"]);

	assert(test2.removeURLFromList("https://google.com/contact/"));
	assert(test2.removeURLFromList("https://google.com/about/"));
	assertEquals(test2.removeURLFromList("google.com"), false);

	assertEquals(test2.getURLList, ["https://google.com"]);

});
