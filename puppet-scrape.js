const puppeteer = require("puppeteer");
const fs = require('node:fs/promises');
const options = require("./src/main/Options.js");
const URLList = require("./src/main/URLList.js");

const readline = require('node:readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

let args = new options(process.argv);


(async () => {
	const browser = await puppeteer.launch({headless: 'new'});
	const page = await browser.newPage();

	const crawlQueue = new URLList([args.options.url]);

	if(crawlQueue.getURLList.length == 0) {
		console.log("Please enter a valid URL to scrape");	
		process.exit();
	}

	for(const url of crawlQueue.getURLList) {
		await page.goto(url);
		const title = await page.title();
		console.log(title);
	}

	await browser.close();
	process.exit();
})();
