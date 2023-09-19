import {isString} from "./Util.js";

class URLList {
	/*
	 * listOfURLs: string or array of strings
	 * 	URLs to initiate URLList
	 * options:
	 * 	internalOnly: bool 
	 * 		If set to true, you can only add URLs to the domain specified.
	 */
	constructor(listOfURLs, options, domain = null) {
		debugger;
		if(isString(listOfURLs)) {
			const arrayWrapper = [];
			arrayWrapper.push(listOfURLs);
			listOfURLs = arrayWrapper;
		}
		if(options && options.internalOnly) {
			if(!domain) {
				throw new Error("If internalOnly is set, you must specify the domain argument in the URLList constructor arguments");
			}

			for(let i = 0 ; i < listOfURLs.length ; i++) {
				debugger;
				if(!URLList.isInDomain(listOfURLs[i], domain)) {
					console.error("URL is not in internal domain. Skipping.");
					listOfURLs.splice(i, 1);
				}
			}
		}

		for(let i = 0 ; i < listOfURLs.length ; i++) {
			if(!URLList.isValidURI(listOfURLs[i])) {
				listOfURLs.splice(i, 1);
			}
		}

		this.urls = listOfURLs;
		this.options = options;
		this.domain = domain;
	}

	static isInDomain(url, domain) {
		const uniformURL = url.replace("https://", "").replace("www.", "").replace("http://", "");
		const uniformDomain = domain.replace("https://", "").replace("www.", "").replace("http://", "");

		const domainRegex = new RegExp(uniformDomain);

		return domainRegex.test(uniformURL);
	}

	static isValidURI(uri) {
		if(!isString(uri)) return false;

		//RegExp from https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
		const urlRegex = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator

		return urlRegex.test(uri);
	}

	addURLToList(url) {
		throw new Error('Not implemented');
		if(Array.isArray(url)) {

		}
		else if(typeof url === 'string' || url instanceof String) {
			
		}
		else {
			throw new Error("Invalid argument to URLList.addURLToList(), must be an array of strings or a string.");
		}
	}

	get getURLList() {
		return this.urls;
	}

	set setURLList(listOfURLs) {
		constructor(listOfURLs, this.options, this.domain);
	}
}

export {URLList};
