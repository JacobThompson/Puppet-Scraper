"use strict"
import { parse } from "https://deno.land/std/flags/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@14.1.1/mod.ts";
import { Parser, unescapeEntity } from 'https://deno.land/x/xmlparser@v0.2.0/mod.ts'
import { createRequire } from "https://deno.land/std/node/module.ts";
import { writeCSV, writeCSVObjects } from "https://deno.land/x/csv/mod.ts";



let args = parse(Deno.args);

console.log(args);

let path;
let cdStatus;


let txt = args.txt ? "Y" : false; 
let pdf = args.pdf ? "Y" : false; 
let titles = args.titles ? "Y" : false;
let metas = args.metas ? "Y" : false;
let docWriteScan = args.docWrite ? "Y" : false;
let logSitemap = args.sitemap ? "Y" : false;
let links = args.links ? "Y" : false;
let findTextOnPages = args.scantext ? "Y" : false;
let options = args.options;
let overwrite = args.overwrite ? true : false;
let scanhtml = args.scanhtml ? true : false;
let altTags = args.alt ? true : false;
let GTMID = args.gtm; 


if(options == true) {
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
	url = await prompt("Please enter the URL to scrape\n");
}

do {
	if(pdf != "Y" && txt != "Y" && links != "Y" && logSitemap == "Y") {
		break;	
	}
	path = await prompt("Please enter where you would like to save the files\n") + "/"; 
	let cd = Deno.run({cmd: ["cd", path]});
	cdStatus = await cd.status();
	if(cdStatus.code != 0) { 
		console.log("Invalid pathname.");
	}

} while (cdStatus.code != 0); 

let useSitemap = await prompt("Would you like to crawl the whole site? (Y/n)");
let sitemap = "n";
if(useSitemap == "Y") 
	sitemap = await prompt("Where should we find the sitemap on the server? (default: /page-sitemap.xml)", "/page-sitemap.xml"); 
let sitemapXML;
if(sitemap != "n") {
	try {
		let response = await fetch(url + sitemap); 
		sitemapXML = await response.text();
	} catch (error) {
		console.log(error);
		Deno.exit(1);
	}
}

let URLs;
if(useSitemap == "Y") {
	URLs = [];
	let output = "";
	const parser = new Parser({});
	const sitemapLinks = parser.parse(sitemapXML);
	for(let url of sitemapLinks.getChild('urlset').find(['url', 'loc'])) {
		URLs.push(url.value);	
		if(logSitemap == "Y") {
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

if(pdf != "Y" && txt != "Y" && logSitemap != "Y" && links != "Y" && metas != "Y" && docWriteScan != "Y" && findTextOnPages != "Y" && titles != "Y" && !altTags) {
	console.error("Warning: You didn't choose an output format.");
}

//if(pdf != "Y" && txt != "Y" && logSitemap == "Y") {
//	Deno.exit(1);
//}

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

	if(txt == "Y") { 
		const innerText = await(page.evaluate(() => {
			return document.body.innerText;
		}));
		const encoder = new TextEncoder();
		let innerTextUTF = encoder.encode(innerText);

		
		await Deno.writeFile(path + urlItem.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".txt", innerTextUTF);
	}
	if(links == "Y") {
		const pagelinks = await (page.evaluate(() => {
			let linksFormatted = "";
			for(let a of document.getElementsByTagName("a")) {
				linksFormatted += "Page: " + window.location.href + " Anchor: {" + a.innerText + "} -> " + a.href + "\n";
			}
			return linksFormatted;
		}));
		const encoder = new TextEncoder();
				
		let linksUTF = encoder.encode(pagelinks);
		let filename = path + urlItem.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".links.txt";
		
		await Deno.writeFile(filename, linksUTF);
	}
	if(metas == "Y") {
		const desc = await(page.evaluate(() => {
			for(let a of document.getElementsByTagName("meta")) {
				if(a.name == "description") {
					return a.content;
				}
			}
		}));
		metaDesc[urlItem] = desc;	
	}
	if(titles == "Y") {
		const title = await(page.evaluate(() => {
			return document.title;
		}));
		titlesList[urlItem] = title;
	}
	if(pdf == "Y") {
		await page.setViewport({width: 1920, height: 1080});	
		await page.emulateMediaType('screen');
		await page.pdf({path: path + urlItem.replaceAll(/:/g, '').replaceAll(/\//g, '_') + ".pdf", format: "A4", printBackground: true});  
	}
	if(docWriteScan == "Y") {
		const containsDocWrite = await (page.evaluate(() => {
			return document.documentElement.innerHTML.includes("document.write");
		}));
		if(containsDocWrite) {
			console.log(urlItem);	
		}
	}

	if(findTextOnPages == "Y") {
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
if(metas == "Y") {
	const encoder = new TextEncoder();
	let output = "";
	for(let md in metaDesc) {
		output += md + ",\"" + metaDesc[md] + "\"\n";
	}
	await Deno.writeFile("MetaDesc.csv", encoder.encode(output));
}
if(titles =="Y") {
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

function parseArguments() {

}

function cleanup() {

}

function main() {

}


