const { stdout } = process;
const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'text.txt');
const rStream = fs.createReadStream(fullPath, 'utf-8');

rStream.on('data', chunk => stdout.write(chunk));
rStream.on('error', error => console.log('Error', error.message));