# Puppet-Scraper

A web scraper written with Puppeteer and Deno

NOTE: This is a very preliminary prototype that is in alpha. 

## Requirements
[deno](https://deno.land/)

## Setup

If this is your first time running, you will need to install Chrome.
To do this run the following command:

```
PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts
```

## How to run

```
deno run --allow-all --unstable scrape.js {arguments}
```

## Available arguments

```
--txt : Saves selected page(s) innerText to individual files.
--pdf : Saves selected page(s) to PDF files.
--titles : Saves a CSV file of the title tags for each page. NOTE: Not working!
--metas : Saves the meta descriptions of each selected page into a csv file. NOTE: Not working!
--links : Saves a text file of link information from each selected page. 
--options : Displays the available arguments
--overwrite : Whether or not to recrawl pages we've already seen 
--url=https://urltocrawl.com : the URL to crawl
```

Please note, this software is in alpha and it's interface is subject to change!

WARNING: This scraper does not respect robots.txt (Coming soon in a future version). Please be vigilant about following robots.txt rules!
