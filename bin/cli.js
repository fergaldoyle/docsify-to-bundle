#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const convert = require('../index.js');

yargs(hideBin(process.argv))
  .command({
    command: '* [path]',
    builder: yargs =>
      yargs.options({
        'input': {
          default: 'index.html',
          alias: 'i',
          nargs: 1,
          requiresArg: true,
          type: 'string'
        },
        'output': {
          default: 'index-bundled.html',
          alias: 'o',
          nargs: 1,
          requiresArg: true,
          type: 'string'
        }
      }),
    handler: argv => convert(argv.path, argv.input, argv.output)
  })
  .argv