#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const convert = require('../index.js');

yargs(hideBin(process.argv))
  .command({
    command: '* [folder]',
    builder: yargs =>
      yargs.options({
        'input': {
          default: 'index.html',
          nargs: 1,
          requiresArg: true,
          type: 'string'
        },
        'output': {
          default: 'index-desktop.html',
          nargs: 1,
          requiresArg: true,
          type: 'string'
        },
        'embed-styles': {
          default: false,
          nargs: 0,
          requiresArg: false,
          type: 'boolean'
        },
        'embed-scripts': {
          default: false,
          nargs: 0,
          requiresArg: false,
          type: 'boolean'
        }
      }),
    handler: convert
  })
  .argv