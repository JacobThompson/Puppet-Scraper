const puppeteer = require("puppeteer");
const options = require("./src/main/Options.js");
const fs = require('node:fs/promises');

let args = Options.parseArgs(process.argv);


