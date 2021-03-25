const glob = require('glob');
const fs = require('fs-extra')
const path = require('path');
const JSDOM = require('jsdom').JSDOM;
const axios = require('axios');
const chalk = require('chalk');
const encode = require('html-entities').encode;

function getUrl(url) {
  if (url.startsWith('//')) {
    return 'https:' + url
  }
  return url;
}

function createScriptElement(document, code) {
  const el = document.createElement('script');
  el.type = 'text/javascript';
  el.text = code;
  return el;
}

const overrideScript = fs.readFileSync(path.join(__dirname, 'scripts', 'override.js'), 'utf8');
const fixSearchScript = fs.readFileSync(path.join(__dirname, 'scripts', 'fix-search.js'), 'utf8');

function convert({
  folder,
  input,
  output,
  embedStyles,
  embedScripts
}) {

  folder = path.normalize(folder || '.');

  // read the index and script to inject
  let html
  try {
    html = fs.readFileSync(path.join(folder, input), 'utf8');
  } catch (e) {
    console.log(chalk.red(`Cannot find or open file: ${path.join(folder, input)}`));
    process.exit(1);
  }

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // inject ajax override script into head
  document.head.appendChild(createScriptElement(document, overrideScript));

  // injects script at end of body
  document.body.appendChild(createScriptElement(document, fixSearchScript));

  // create element to hold injected markdown content
  const mdEl = document.createElement('div');
  mdEl.style.display = 'none';
  document.querySelector('#app').insertAdjacentElement('beforebegin', mdEl);

  glob(`${folder}/**/*.md`, async (er, files) => {

    // Embed all .md files into index.html
    files.forEach(file => {
      const contents = fs.readFileSync(file, 'utf8');
      const pre = document.createElement('pre');
      pre.innerHTML = encode(contents);
      pre.setAttribute('data-md', path.relative(folder, file));
      mdEl.appendChild(pre);
    });

  
    // ensure styles begin with https    
    for (const element of Array.from(document.querySelectorAll('[rel=stylesheet][href]'))) {
      const href = getUrl(element.getAttribute('href'))
      element.setAttribute('href', href);

      if (embedStyles && href.startsWith('http')) {
        // Embed styles
        const { data } = await axios.get(href);
        const styleEl = document.createElement('style');
        styleEl.textContent = data;
        element.insertAdjacentElement('beforebegin', styleEl);
        element.remove();
      }
    }   

    // ensure scripts begin with https    
    for (const element of Array.from(document.querySelectorAll('script[src]'))) {
      const src = getUrl(element.getAttribute('src'));
      element.setAttribute('src', src);

      // Embed scripts
      if (embedScripts && src.startsWith('http')) {
        const { data } = await axios.get(src);
        element.insertAdjacentElement('beforebegin', createScriptElement(document, '\n' + data));
        element.remove();
      }
    }
  

    // write the html doc out
    fs.ensureFileSync(path.join(folder, output));
    fs.writeFileSync(path.join(folder, output), dom.serialize(), 'utf8');
    console.log(chalk.yellow(`Bundle written to: ${path.join(folder, output)}`));
  });
}

module.exports = convert;