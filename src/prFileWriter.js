const fs = require('fs');
const { render } = require('mustache');

const file = fs.readFileSync('./templates/file.md').toString();
const request = fs.readFileSync('./templates/request.md').toString();

const dir = './output/pr';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

async function writeFile(data) {
  let report = '';

  data.requests.forEach((req) => {
    report += render(request, req);

    req.changes.forEach((change) => {
      report += render(file, change);
    });
  });

  data.number = data.pull_number;
  fs.writeFileSync(`${dir}/${data.pull_number}.md`, report);
}

class FileWriter {
  async write(data) {
    await writeFile(data);
  }
}

module.exports = new FileWriter();
