# Puppet-Scraper

A web scraper written with Puppeteer and ~~Deno~~ Node.js

NOTE: This is a very preliminary prototype that is in alpha. Not currently working. 

STATUS: This project has a dependency on deno-puppeteer. This dependency is no being maintained.
This project is being ported to node.js


## Requirements
[node.js 20](https://nodejs.org/)


## How to run

```
node puppet-scrape.js {arguments}
```

## Available arguments

```
--txt : Saves selected page(s) innerText to individual files.
--pdf : Saves selected page(s) to PDF files.
--titles : Saves a CSV file of the title tags for each page. NOTE: Not working!
--metas : Saves the meta descriptions of each selected page into a csv file. NOTE: Not working!
--links : Saves a text file of link information from each selected page. 
--help: Displays the available arguments
--overwrite : Whether or not to recrawl pages we've already seen 
--url=https://urltocrawl.com : the URL to crawl
```

Please note, this software is in alpha and it's interface is subject to change!

WARNING: This scraper does not respect robots.txt (Coming soon in a future version). Please be vigilant about following robots.txt rules!
