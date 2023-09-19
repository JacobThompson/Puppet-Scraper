import {isString} from "./Util.js";
import {PUPPET_SCRAPE_LOG} from "./EventLog.js";

class URLList {
	/*
	 * listOfURLs: string or array of strings
	 * 	URLs to initiate URLList
	 * options:
	 * 	internalOnly: bool 
	 * 		If set to true, you can only add URLs to the domain specified.
	 * 	ignoreCanonical: bool
	 * 		If set to true, remove duplicate URLs with varying www subdomains and http protocols.
	 */
	constructor(listOfURLs, domain = null, options) {
		if(isString(listOfURLs)) {
			const arrayWrapper = [];
			arrayWrapper.push(listOfURLs);
			listOfURLs = arrayWrapper;
		}

		URLList.removeInvalidURLs(listOfURLs);

		if(options && options.internalOnly) {
			if(!domain) {
				throw new Error("If internalOnly is set, you must specify the domain argument in the URLList constructor arguments");
			}

			for(let i = 0 ; i < listOfURLs.length ; i++) {
				if(!URLList.isInDomain(listOfURLs[i], domain)) {
					PUPPET_SCRAPE_LOG.warn("URL is not in internal domain. Skipping.");
					listOfURLs.splice(i, 1);
					i--;
				}
			}
		}

		const urlSet = new Set(listOfURLs);

		this.urls = urlSet;
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

	static removeInvalidURLs(urls) {
		if(!Array.isArray(urls)) throw new Error("URLList.removeInvalidURLs argument must be an array");

		for(let i = 0 ; i < urls.length ; i++) {
			if(!URLList.isValidURI(urls[i])) {
				urls.splice(i, 1);
				i--;
			}
		}
		return urls;
	}

	addURLToList(url) {
		if(Array.isArray(url)) {
			URLList.removeInvalidURLs(url);
			for(const u of url) {
				if(this.options && this.options.internalOnly && !URLList.isInDomain(u, this.domain)) continue;
				this.urls.add(u);
			}
		}
		else if(isString(url)) {
			if(!URLList.isValidURI(url)) return;
			if(this.options && this.options.internalOnly && !URLList.isInDomain(url, this.domain)) return;
			this.urls.add(url);	
		}
		else {
			throw new Error("Invalid argument to URLList.addURLToList(), must be an array of strings or a string.");
		}
	}

	removeURLFromList(url) {
		return this.urls.delete(url);
	}

	get getURLList() {
		return Array.from(this.urls);
	}
}

export {URLList};
