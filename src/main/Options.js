class Options {
	options = {
		text: false,
		pdf: false,
		titles: false,
		metaDescriptions: false,
		links: false,
		overwrite: false,
		url: '',
	};

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
		const args = argv.slice(2);

		let argsList = {};

		for(const arg of args) {
			argsList[arg.replace('--', '').replace('-', '')] = arg.split('=')[1] ?? true;
		}

		return argsList;
	}
}

module.exports = Options;
