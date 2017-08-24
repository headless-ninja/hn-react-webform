const pkg = require('../package.json');

delete pkg.scripts.postinstall;
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
