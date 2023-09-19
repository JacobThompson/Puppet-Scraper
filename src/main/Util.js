import {PUPPET_SCRAPE_LOG} from "./EventLog.js";

export function isString(testString) {
	return typeof testString === 'string' || testString instanceof String;
}
