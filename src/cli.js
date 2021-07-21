#!/usr/bin/env node

'use strict';

const parseArgs = require('minimist');
const args = parseArgs(process.argv.slice(2), {
	string: 'file'
});

if (args.file === undefined) {
	console.error('No files were passed, please specify the files you would like to build from using the --file flag.');
	process.exit(1);
}

let files;

if (Array.isArray(args.file)) {
	files = args.file;
} else {
	files = [args.file];
}

const build = require('./build');

build(files)
	.catch(err => {
		console.error(err.stack);
		process.exit(1);
	});