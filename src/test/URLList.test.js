import {assertEquals} from "https://deno.land/std@0.201.0/assert/mod.ts";
import {URLList} from "../main/URLList.js";

Deno.test("Testing URLList.isInDomain", () => {
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

Deno.test("Testing URLList.isValidURI", () => {
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

Deno.test("Testing URLList constructor", () => {
	const test1 = new URLList("https://google.com");

	assertEquals(test1.getURLList, ["https://google.com"]);


	const test2 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);

	assertEquals(test2.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"]);


	const test3 = new URLList(["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact", "https://google.com"], {internalOnly: true}, "facebook.com");

	assertEquals(test3.getURLList, ["https://facebook.com", "https://facebook.com/profile", "https://facebook.com/about", "https://facebook.com/contact"]);
});

