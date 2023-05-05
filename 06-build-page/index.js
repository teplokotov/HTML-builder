const fs = require('fs');
const path = require('path');

// For assets
const sourcePath = path.join(__dirname, 'assets');
const distPath = path.join(__dirname, 'project-dist');
const targetPath = path.join(distPath, 'assets');
// For style.css
const resultFile = 'style.css';
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundleFile = path.join(bundlePath, resultFile);
// Options:
const optionsMkDir = { recursive: true };
const optionsReadDir = { withFileTypes: true };
const optionsReadFile = { encoding: 'utf8' };
const optionsRmFile = { force: true, recursive: true };
// Components:
const componentsPath = path.join(__dirname, 'components');
const components = {};
// Template:
const templateFile = path.join(__dirname, 'template.html');
const resultHtmlFile = path.join(bundlePath, 'index.html');

fs.promises.rm(distPath, optionsRmFile)
  .catch(error => console.log(error))
  .then(() => makeCopy(sourcePath, targetPath))
  .then(() => mergeFiles(stylesPath))
  .then(() => applyTemplate(componentsPath))
  .finally(() => console.log('Сборка завершена!'));

function appendFile(filename, chunk) {
  fs.promises.appendFile(bundleFile, chunk)
  .catch((error) => console.log(error));
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

function makeCopy(sPath, tPath) {
  fs.promises.mkdir(tPath, optionsMkDir)
    .catch((error) => console.log(error))
    .then(() => {
      fs.promises.readdir(sPath, optionsReadDir)
      .then(foldernames => {
        foldernames.forEach(folder => {
          if (folder.isDirectory()) {
            const sFolder = path.join(sPath, folder.name);
            const tFolder = path.join(tPath, folder.name);
            makeCopy(sFolder, tFolder);
          }
        });
      })
      .catch(error => console.log(error));
    })
    .then(() => copyFiles(sPath, tPath));
}

function copyFiles(sPath, tPath) {
  fs.promises.readdir(sPath, optionsReadDir)
    .then(filenames => {
      filenames.forEach(file => {
        if (file.isFile()) {
          const sFile = path.join(sPath, file.name);
          const tFile = path.join(tPath, file.name);
          fs.promises.copyFile(sFile, tFile)
            .catch(error => console.log(error));
        }
      });
    })
    .catch(error => console.log(error));
}

function applyTemplate(sPath) {
  fs.promises.readdir(sPath, optionsReadDir)
    .then(filenames => {
      filenames.forEach(file => {
        const name = file.name.split('.').slice(0,-1).join();
        const extname = path.extname(file.name).substring(1);
        if (file.isFile() && extname === 'html') {
          const sFile = path.join(sPath, file.name);
          fs.promises.readFile(sFile, optionsReadFile)
            .catch(error => console.log(error))
            .then((data) => components[name] = data);
        }
      });
    })
    .then(() => createHTML(templateFile, resultHtmlFile, components))
    .catch(error => console.log(error));
}

function createHTML(sPath, tPath, tempObj) {
  fs.promises.readFile(sPath, optionsReadFile)
    .catch(error => console.log(error))
    .then((data) => {
      for (let [key, value] of Object.entries(tempObj)) {
        const section = `{{${key}}}`;
        data = data.replaceAll(section, value);
      }
      return data;
    })
    .then((data) => {
      fs.promises.writeFile(tPath, data)
        .catch(error => console.log(error));
    });
}