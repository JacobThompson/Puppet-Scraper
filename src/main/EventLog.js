import { Logger } from 'https://deno.land/x/log/mod.ts'

const logFile = "./scrape-log.txt";
export const PUPPET_SCRAPE_LOG = await Logger.getInstance("INFO", "DEBUG", logFile);

