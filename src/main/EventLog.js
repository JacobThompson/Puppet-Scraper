const {createLogger, format, transports} = require('winston');
const {combine, timestamp, simple} = format;

const logFile = "./scrape-log.txt";
const PUPPET_SCRAPE_LOG = createLogger({
	level: "verbose", 
	format: combine(
		timestamp(),
		simple()
	),
	defaultMeta: { service: 'puppet-logger' },
	transports: [
		new transports.File({filename: logFile}),
		new transports.Console(),
	],
});

module.exports = PUPPET_SCRAPE_LOG;
