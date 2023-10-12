const isString = require('./Util.js');
const PUPPET_SCRAPE_LOG = require('./EventLog.js');

class Options {
	constructor(argv) {
		const listOfArguments = Options.parseArgv(argv);
		this.options = {}
		if(listOfArguments?.txt === true) {
			this.options.text = true;
		}
		if(listOfArguments?.help === true) {
			Options.printHelp();
			process.exit();
		}
		if(listOfArguments?.titles === true) {
			this.options.titles = true;
		}
		if(listOfArguments?.metas === true) {
			this.options.metaDescriptions = true;
		}
		if(listOfArguments?.links === true) {
			this.options.links = true;
		}
		if(listOfArguments?.overwrite === true) {
			this.options.overwrite = true
		}
		if(listOfArguments?.pdf === true) {
			this.options.pdf = true;
		}
		if(isString(listOfArguments?.url)) {
			this.options.url = listOfArguments.url;
		}
		if(listOfArguments?.sitemap === true) {
			this.options.sitemap = true;
		}
		if(listOfArguments?.pagediscover == true) {
			this.options.pagediscover = true;
		}

		delete listOfArguments.txt;
		delete listOfArguments.help;
		delete listOfArguments.titles;
		delete listOfArguments.metas;
		delete listOfArguments.links;
		delete listOfArguments.overwrite;
		delete listOfArguments.url;
		delete listOfArguments.pdf;
		delete listOfArguments.sitemap;
		delete listOfArguments.pagediscover;

		for(const arg in listOfArguments) {
			PUPPET_SCRAPE_LOG.log({
				level: 'warn',
				message: 'Provided argument not recognized: ' + arg,
			});
		}
	}

	static printHelp() {
		console.log("A website scraper.\n");

		console.log("This software can be run in interactive mode by simply running the main javascript file.\n");

		console.log("Usage: npx scrape.js [OPTIONS]\n");

		console.log("Options:");

		console.log("    --txt");
		console.log("        Save page innertext to a text file.\n");
		console.log("    --help");
		console.log("        Display this help prompt\n"); 
		console.log("    --titles\n");
		console.log("        Save page title tags to a csv file.\n"); 
		console.log("    --metas\n");
		console.log("        Save page meta descriptions to a csv file.\n"); 
		console.log("    --links\n");
		console.log("        Save page links (hrefs, anchor texts, page locations) to a csv file.\n"); 
		console.log("    --overwrite\n");
		console.log("        Use this to enable overwriting previously created files.\n"); 
		console.log("    --url=[URL]\n");
		console.log("        Designate the URL to scrape.\n"); 
	}

	static parseArgv(argv) {
		if(!Array.isArray(argv)) {
			throw new TypeError("Arguments must be provided as an array");
		}
		const args = argv.slice(2);

		let argsList = {};

		for(const arg of args) {
			if(!isString(arg)) {
				continue;
			}
			const splitOnEquals = arg.split("=");
			argsList[splitOnEquals[0].replace('--', '').replace('-', '')] = splitOnEquals[1] ?? true;
		}

		return argsList;
	}
	
	get argList() {
		return this.options;
	}
}

module.exports = Options;
