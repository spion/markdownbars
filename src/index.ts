#!/usr/bin/env node

import * as fs from 'fs'
import * as yargs from 'yargs'
import * as hbs from 'handlebars'
import * as path from 'path'

import { handle } from './processor';

export let args = yargs
.usage('Usage: markdownbars -i input.hbs.md [-o output.md]')
.options({
  input: {
    alias: 'i',
    describe: 'Input file',
    type: 'string',
    demandOption: true
  },
  output: {
    alias: 'o',
    describe: 'Output file',
    type: 'string',
    demandOption: false
  },
  help: {
    alias: 'h',
    describe: 'Generate help',
    type: 'boolean',
    default: false
  },
  data: {
    alias: 'd',
    describe: 'Additional JSON data to pass into the template',
    type: 'string',
    default: '{}'
  }
}).argv;


let data = JSON.parse(args.data)
let filePath = path.resolve(process.cwd(), args.input);
let output = handle(filePath, data);
if (args.output) fs.writeFileSync(args.output, output)
else console.log(output);
