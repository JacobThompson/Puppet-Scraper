import Logger from "https://deno.land/x/logger@v1.1.2/logger.ts";

const PUPPET_SCRAPE_LOG = new Logger();
await PUPPET_SCRAPE_LOG.initFileLogger("../ScraperEvents.log");
PUPPET_SCRAPE_LOG.disableConsole();

export {PUPPET_SCRAPE_LOG};
