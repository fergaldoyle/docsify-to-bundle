const glob = require('glob');
const fs = require('fs');
const path = require('path');
const JSDOM = require('jsdom').JSDOM;
const axios = require('axios');
const chalk = require('chalk');
const encode = require('html-entities').encode;

function getUrl(url) {
  if(url.startsWith('//')) {
    return 'https:' + url
  }
  return url;
}

function convert(folder, input, output) {
  folder = path.normalize(folder || '.');

  // read the index and script to inject
  let html
  try {
    html = fs.readFileSync(path.join(folder, input), 'utf8');
  } catch(e) {
    console.log(chalk.red(`Cannot find or open file: ${path.join(folder, input)}`));
    process.exit(1);
  }
  const injectedScript = fs.readFileSync(`${__dirname}/script.js`, 'utf8');

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // inject ajax override script into head
  const script_tag = document.createElement('script');
  script_tag.type = 'text/javascript';
  script_tag.text = injectedScript;
  document.head.appendChild(script_tag);

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

    // Embed styles
    for (const element of Array.from(document.querySelectorAll('[rel=stylesheet][href]'))) {
      const {
        data
      } = await axios.get(getUrl(element.getAttribute('href')));
      const styleEl = document.createElement('style');
      styleEl.textContent = data;
      element.insertAdjacentElement('beforebegin', styleEl);
      element.remove();
    }

    // Embed scripts
    for (const element of Array.from(document.querySelectorAll('script[src]'))) {
      const {
        data
      } = await axios.get(getUrl(element.getAttribute('src')));
      const script_tag = document.createElement('script');
      script_tag.type = 'text/javascript';
      script_tag.text = '\n' + data;
      element.insertAdjacentElement('beforebegin', script_tag);
      element.remove();
    }

    // write the html doc out
    fs.writeFileSync(path.join(folder, output), dom.serialize(), 'utf8');
    console.log(chalk.yellow(`Bundle written to: ${path.join(folder, output)}`));
  });
}

module.exports = convert;