"use strict"
const puppeteer = require("puppeteer");
const { XMLParser } = require("fast-xml-parser");
//const { writeCSV, writeCSVObjects } from "https://deno.land/x/csv@v0.9.1/mod.ts";

let args = process.argv.slice(2);

let path;
let cdStatus;

//TODO properly parse args from deno.
let txt = args.txt;
let pdf = args.pdf;
let titles = args.titles;
let metas = args.metas;
let docWriteScan = args.docWrite;
let logSitemap = args.sitemap;
let links = args.links;
let findTextOnPages = args.scantext;
let options = args.options;
let overwrite = args.overwrite;
let scanhtml = args.scanhtml;
let altTags = args.alt;
let GTMID = args.gtm; 

if(options) {
	console.log("help");
	console.log("txt");
	console.log("pdf")
	console.log("titles");
	console.log("metas");
	console.log("docWriteScan");
	console.log("logSitemap");
	console.log("links");
	console.log("scantext");
	console.log("scanhtml");
	console.log("options");
	console.log("overwrite");
	console.log("gtm");
	console.log("url=https://google.com");
	Deno.exit(0);
}

let url = args.url;
if(!args.url) {
	url = prompt("Please enter the URL to scrape\n");
}

do {
	if(!pdf && !txt && !links && !logSitemap) {
		break;	
	}
	path = prompt("Please enter where you would like to save the files\n"); 
	const stat = await Deno.stat(path);
	cdStatus = stat.isDirectory;
	if(!cdStatus) { 
		console.log("Invalid pathname.");
	}

} while (!cdStatus); 
path += "/";

let useSitemap = prompt("Would you like to crawl the whole site? (Y/n)");
let sitemap;
if(useSitemap === "Y") 
	sitemap = prompt("Where should we find the sitemap on the server? (default: /page-sitemap.xml)", "/page-sitemap.xml"); 
let sitemapXML;
if(useSitemap === "Y") {
	try {
		let response = await fetch(url + sitemap); 
		sitemapXML = await response.text();
	} catch (error) {
		console.log(error);
		Deno.exit(1);
	}
}

let URLs;
if(useSitemap === "Y") {
	URLs = [];
	let output = "";
	const parser = new Parser({});
	const sitemapLinks = parser.parse(sitemapXML);
	for(let url of sitemapLinks.getChild('urlset').find(['url', 'loc'])) {
		URLs.push(url.value);	
		if(logSitemap) {
			console.log(url.value);
			output += url.value + "\n";
		}
	}
	let encoder = new TextEncoder();
	await Deno.writeFile(path + "pages.csv", encoder.encode(output));
}
else {
	URLs = [url];
}

if(!pdf && !txt && !logSitemap && !links && !metas && !docWriteScan && !findTextOnPages && !titles && !altTags) {
	console.error("Warning: You didn't choose an output format.");
}

let browser = await puppeteer.launch({ignoreHTTPSErrors: true});
let page = await browser.newPage();
let images = [];
images.push(['Image Source', 'Alt Tag', 'Image Location']);
let metaDesc = {};
let titlesList = {};
let crawledURLsHistory 
let crawledURLs = []; 

try {
	await Deno.stat("urlhistory.json");
	crawledURLsHistory = await Deno.readTextFile("urlhistory.json");
	crawledURLs = JSON.parse(crawledURLsHistory);
}
catch(e) {
	console.log("Writing new history file.");
	await Deno.writeTextFile("urlhistory.json", "[]");
}
for(let urlItem of URLs) {
	if(!overwrite) {
		if(!crawledURLs.includes(urlItem)) {
			crawledURLs.push(urlItem);
		}
		else {
			continue;
		}
	}

	try {
		let crawledURLHistoryWrite = await Deno.writeTextFile("urlhistory.json", JSON.stringify(crawledURLs));
		console.log("Archiving URL: " + urlItem);
	}
	catch(e) {
		console.log("Unable to write history to file.");
	}

	try {
		const response = await page.goto(urlItem);
		let redirectChain = response.request().redirectChain();
		if(redirectChain.length > 1) {
			console.log("Redirection with sitemap link");
		}
	} catch (error) {
		console.log(error);
		browser.close();
		browser = await puppeteer.launch({ignoreHTTPSErrors: true});
		page = await browser.newPage();
	}

	if(txt) { 
		const innerText = await(page.evaluate(() => {
			return document.body.innerText;
		}));
		const encoder = new TextEncoder();
		let innerTextUTF = encoder.encode(innerText);

		
		await Deno.writeFile(path + urlItem.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".txt", innerTextUTF);
	}
	if(links) {
		const pagelinks = await (page.evaluate(() => {
			let linksFormatted = [];
			for(let a of document.getElementsByTagName("a")) {
				linksFormatted.push([window.location.href ?? null, a.innerText ?? null, a.href ?? null]);
			}
			return linksFormatted;
		}));
				
		const filename = path + url.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".links.csv";

		const file = await Deno.open(path + filename, {
			write: true,
			create: true,
			append: true
		});
		
		await writeCSV(file, pagelinks);

		//Fix no newline at the end of file causing last line of the write to overlap with first line when appended.
		await Deno.writeTextFile(path + filename, "\n", {append: true});
	}
	if(metas) {
		const desc = await(page.evaluate(() => {
			for(let a of document.getElementsByTagName("meta")) {
				if(a.name == "description") {
					return a.content;
				}
			}
		}));
		metaDesc[urlItem] = desc;	
	}
	if(titles) {
		const title = await(page.evaluate(() => {
			return document.title;
		}));
		titlesList[urlItem] = title;
	}
	if(pdf) {
		await page.setViewport({width: 1920, height: 1080});	
		await page.emulateMediaType('screen');
		await page.pdf({path: path + urlItem.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".pdf", format: "A4", printBackground: true});  
	}
	if(docWriteScan) {
		const containsDocWrite = await (page.evaluate(() => {
			return document.documentElement.innerHTML.includes("document.write");
		}));
		if(containsDocWrite) {
			console.log(urlItem);	
		}
	}

	if(findTextOnPages) {
		const containsText = await (page.evaluate(() => {
			let textContained = document.documentElement.innerHTML.toLowerCase().includes("pre-abortion screening") || 
				document.documentElement.innerText.toLowerCase().includes("preabortionscreening") || 
				document.documentElement.innerText.toLowerCase().includes("preabortion screening") ||
				document.documentElement.innerHTML.toLowerCase().includes("pre abortion screening");
			return textContained;
		}));
		if(containsText) {
			console.log(urlItem);
		}
	}

	if(GTMID) {
		const gtagIDOnSite = await(page.evaluate(() => {
			let scraped_gtagid = document.documentElement.innerHTML.match(/GTM-[A-Z0-9]{7}/);
			if(scraped_gtagid === null) {
				return false;
			}
			return scraped_gtagid[0];
		}));
		GTMID = false;
		if(!gtagIDOnSite) {
			console.log("Gtag Manager not found on site");
		}
		else {
			console.log("Google Tag Manager ID: " + gtagIDOnSite);
		}
	}


	if(scanhtml) {
		const getHTML = await(page.evaluate(() => {
			let innerHTML = document.documentElement.innerHTML;
			return innerHTML;
		}));

		const encoder = new TextEncoder();

		let htmlEnc = encoder.encode(getHTML);
		let filename = path + urlItem.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".links.txt";
		
		await Deno.writeFile(filename, htmlEnc);
			
	}

	if(altTags) {
		const imagesInfo = await (page.evaluate(() => {
			let retArr = [];
			for(const img of document.images) {
				retArr.push([img.getAttribute('data-src') ? img.getAttribute('data-src') : img.src, img.alt, window.location.href]);	
			}
			return retArr;
		}));


		for(const image of imagesInfo) {
			images.push(image);			
		}
	}

}
if(metas) {
	const encoder = new TextEncoder();
	let output = "";
	for(let md in metaDesc) {
		output += md + ",\"" + metaDesc[md] + "\"\n";
	}
	await Deno.writeFile("MetaDesc.csv", encoder.encode(output));
}
if(titles){
	const encoder = new TextEncoder();
	let output = "";
	for(let title in titlesList) {
		output += '"' + title + '","' + titlesList[title] + '\n';
	}
	await Deno.writeFile("Titles.csv", encoder.encode(output));
}
if(altTags) {
	const imagesFile = await Deno.open("Images.csv", {
		write: true,
		create: true,
		truncate: true,
	});


	await writeCSV(imagesFile, images);
}

await browser.close();

