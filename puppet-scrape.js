const puppeteer = require("puppeteer");
const fs = require('node:fs');
const options = require("./src/main/Options.js");
const URLList = require("./src/main/URLList.js");
const PUPPET_SCRAPE_LOG = require("./src/main/EventLog.js");
const http = require("node:http");
const buffer = require("node:buffer");

const readline = require('node:readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

let args = new options(process.argv);


(async () => {
	const browser = await puppeteer.launch({headless: 'new'});
	const page = await browser.newPage();

	const crawlQueue = new URLList([args.options.url], args.options.url);

	if(crawlQueue.getURLList.length == 0) {
		console.log("Please enter a valid URL to scrape");	
		process.exit();
	}

	if(args.options.sitemap) {
		crawlQueue.addURLsFromSitemap();
	}

	for(const url of crawlQueue.getURLList) {
		await page.goto(url);

		if(args.options.pagediscover) {
			const pageURLs = await page.evaluate(() => {
				return Array.from(document.links).map(a => a.href);	
			});

			crawlQueue.addURLToList(pageURLs);
		}

		if(args.options.text) {
			const pageText = await page.evaluate(() => {
				return document.documentElement.innerText;
			});

			const pageTextArray = new Uint8Array(Buffer.from(pageText));

			//const fileToWrite = fs.open("./data/" + URLList.standardizeURLForFS(url) + ".innertext.txt");
			
			fs.writeFile("./data/" + URLList.standardizeURLForFS(url) + ".innertext.txt", pageTextArray, (err) => {
				console.log(err);
			});
		}

		if(args.options.titles) {

		}

		if(args.options.metas) {

		}

		if(args.options.links) {

		}

		if(args.options.pdf) {

		}
	}

	await browser.close();
	process.exit();
})();
