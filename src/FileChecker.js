const anyleaf = require('any-leaf');
const frontEnd = require('../data/agent-frontEnd-js');
const path = require('path');

const sourceFiles = anyleaf.getLeaves(frontEnd);

async function findMatch(file) {
  let found = '';
  for (let i = 0; i < sourceFiles.length; i++) {
    const f = sourceFiles[i];
    if (f.value.toString().includes(file)) {
      found = f.value.toString();
    }
  }

  return found > '' ? found : null;
}

class FileChecker {
  async find(file) {
    return findMatch(path.basename(file));
  }
}

module.exports = new FileChecker();
