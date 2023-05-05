const fs = require('fs');
const path = require('path');

const fullPath = path.join(__dirname, 'secret-folder');
const options = { withFileTypes: true };

fs.readdir(fullPath, options, (error, files) => {
  if (error)
    console.log(error);
  else {
    files.forEach(file => {
      if(file.isFile()) {
        const name = file.name.split('.').slice(0,-1).join();
        const extname = path.extname(file.name).substring(1);
        const filePath = path.join(fullPath, file.name);
        fs.stat(filePath, (error, stats) => {
          if (error)
            console.log(error);
          else { 
            const size = (stats.size / 1024).toFixed(3);
            console.log(`${name} - ${extname} - ${size}kb`);
          }
        });
      }
    });
  }
});