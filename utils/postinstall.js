/* eslint-disable no-console,global-require */
const spawn = require('child_process').spawnSync;
const path = require('path');

if(!require('fs').existsSync(path.join(__dirname, '../node_modules/eslint'))) {
  console.log('Installing devDependencies of hn-react-webform..', path.join(__dirname, 'node_modules/eslint/package.json'));
  spawn('npm', 'install --ignore-scripts'.split(' '), { cwd: __dirname, stdio: 'inherit' });
} else {
  console.log('DevDependencies of hn-react-webform already installed, not installing again.');
}

if(!require('fs').existsSync(path.join(__dirname, '../lib'))) {
  console.log('Building hn-react-webform..');
  spawn('npm', 'run build'.split(' '), { cwd: __dirname, stdio: 'inherit' });

  console.log('Building done, hn-react-webform is ready to go!');
} else {
  console.log('Already built hn-react-webform, not building again.');
}
