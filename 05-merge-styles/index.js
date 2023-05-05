const fs = require('fs');
const path = require('path');

const resultFile = 'bundle.css';
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundleFile = path.join(bundlePath, resultFile);
const optionsReadDir = { withFileTypes: true };
const optionsRmFile = { force: true, recursive: true };

function appendFile(filename, chunk) {
  fs.promises.appendFile(bundleFile, chunk)
    .catch((error) => console.log(error))
    .then(() => console.log(`Файл ${filename} добавлен в ${resultFile}`));
}

function mergeFiles(mergeDir) {
  fs.promises.readdir(mergeDir, optionsReadDir)
    .then(filenames => {
      filenames.forEach(file => {
        const extname = path.extname(file.name).substring(1);
        if (file.isFile() && extname === 'css') {
          const currFile = path.join(mergeDir, file.name);
          const rStream = fs.createReadStream(currFile, 'utf-8');
          rStream.on('data', chunk => appendFile(file.name, chunk));
          rStream.on('error', error => console.log('Error', error.message));
        }
      });
    })
    .catch(error => console.log(error));
}

fs.promises.rm(bundleFile, optionsRmFile)
  .catch(error => console.log(error))
  .then(() => mergeFiles(stylesPath));