const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');
const optionsMkDir = { recursive: true };
const optionsReadDir = { withFileTypes: true };

function copyFiles() {
  fs.promises.readdir(sourcePath, optionsReadDir)
    .then(filenames => {
      filenames.forEach(file => {
        if (file.isFile()) {
          const sFile = path.join(sourcePath, file.name);
          const tFile = path.join(targetPath, file.name);
          fs.promises.copyFile(sFile, tFile)
            .catch(error => console.log(error));
        }
      });
    })
    .catch(error => console.log(error))
    .then(() => console.log('Файлы скопированы'));
}

fs.promises.mkdir(targetPath, optionsMkDir)
  .catch((error) => console.log(error))
  .then(() => copyFiles());
