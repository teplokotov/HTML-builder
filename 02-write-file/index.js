const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'text.txt');
const wStream = fs.createWriteStream(fullPath);

stdin.on('data', data => {
  data.toString().replace('\r\n', '') === 'exit' ? process.emit('SIGINT') : wStream.write(data);
});
process.on('SIGINT', () => {
  stdout.write('\nВвод данных окончен, спасибо!\n');
  process.exit();
});
wStream.on('error', error => console.log('Error', error.message));