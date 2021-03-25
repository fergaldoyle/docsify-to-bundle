# docsify-to-desktop

## Description
Converts docsify produced documentation into a single HTML file which can be opened without running on a web server. I.E. It can be opened by launching the webpage from your desktop and you won't get XMLHttpRequest errors.


It:
* Bundles the contents of all .md files into the HTML
* Patches `XMLHttpRequest` to trick it into loading the md content from the HTML file instead of a Http Request
* Optionally downloads remote CSS and JS and embeds them into the HTML
* Writes the new index.html file to `index-desktop.html`

<br>

## Install
`npm i -g docsify-to-desktop`

<br>

## Usage
```
# Init docsify (or use existing)
docsify init docs

# Bundle the docsify files found in the docs folder
docsify-to-desktop docs

# Run docsify-to-desktop without specifying a folder to run in the current directory
cd docs
docsify-to-desktop
```

<br>

## Options
* `--input` - Default `index.html`
* `--output` - Default `index-output.html`
* `--embed-styles` - Download and embed remote stylesheets
* `--embed-scripts ` - Download and embed remote scripts

