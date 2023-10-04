const winston = require('winston');

const logFile = "./scrape-log.txt";
export const PUPPET_SCRAPE_LOG = winston.createLogger({
	level: "info", 
	format: winston.format.json(),
	defaultMeta: { service: 'puppet-logger' },
	transports: [
		new winston.transports.File({filename: logFile});
	],
});

