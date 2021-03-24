# docsify-to-bundle

## Description
Converts docsify produced documentation into a single HTML file which can be opened without running on a web server.

It:
* Bundles the contents of all .md files into the HTML
* Patches `XMLHttpRequest` to trick it into loading the md content from the HTML file instead of a Http Request
* Downloads external CSS and JS an embeds them into the HTML

## Install
`npm i -g docsify-to-bundle`


## Usage
```
# Init docsify (or use existing)
docsify init docs

# Bundle the docsify files found in the docs folder
docsify-to-bundle docs

# Run docsify-to-bundle without specifying a folder to run in the current directory
cd docs
docsify-to-bundle
```


## Options
```
docsify-to-bundle folder --input=index.html --output=index-bundled.html
```
