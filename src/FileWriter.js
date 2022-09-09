const fs = require('fs');
const { render } = require('mustache');

const file = fs.readFileSync('./templates/file.md').toString();
const header = fs.readFileSync('./templates/header.md').toString();
const request = fs.readFileSync('./templates/request.md').toString();

const dir = './output';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

async function writeFile(data) {
  data.multiple = data.requests.length === 1 ? '' : 's';

  let report = '';
  report += render(header, data);

  data.requests.forEach((req) => {
    report += render(request, req);

    req.changes.forEach((change) => {
      report += render(file, change);
    });
  });

  fs.writeFileSync(`${dir}/${data.milestone}.md`, report);
}

class FileWriter {
  async write(data) {
    await writeFile(data);
  }
}

module.exports = new FileWriter();
