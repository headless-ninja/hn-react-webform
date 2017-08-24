/* eslint-disable no-console,global-require */
const spawn = require('child_process').spawnSync;

if(!require('fs').existsSync('./lib')) {
  console.log('Installing devDependencies of hn-react-webform..');
  spawn('npm', 'install --ignore-scripts'.split(' '), { cwd: __dirname, stdio: 'inherit' });

  console.log('Building hn-react-webform..');
  spawn('npm', 'run build'.split(' '), { cwd: __dirname, stdio: 'inherit' });

  console.log('Building done, hn-react-webform is ready to go!');
} else {
  console.log('Already built hn-react-webform, not building again.');
}
