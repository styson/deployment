const { request } = require('@octokit/request');
const fileChecker = require('./src/FileChecker');
const prFileWriter = require('./src/prFileWriter');
const pullChecker = require('./src/PullChecker');
const requestDefaults = require('./defaults');
requestDefaults.headers.authorization = `token ${process.env.API_TOKEN}`;

const requestWithAuth = request.defaults(requestDefaults);

const pull_number = '8340';

const data = {
  pull_number,
  requests: [],
};

async function main() {
  let prNumber = '';
  let prState = '';
  let prTitle = '';

  const pulls = await requestWithAuth('GET /repos/{owner}/{repo}/pulls', { state: 'all' });
  for (let i = 0; i < pulls.data.length; i++) {
    const pr = pulls.data[i];
    if (pr.number == data.pull_number) {
      prNumber = pr.number;
      prState = pr.state;
      prTitle = pr.title;
      i = pulls.data.length;
    }
  }

  const files = await requestWithAuth('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', { pull_number: data.pull_number });

  let summary = `${files.data.length === 1 ? 'There is' : 'There are'} ${files.data.length} file change${files.data.length === 1 ? '' : 's'}.`;

  const changes = [];
  for (let i = 0; i < files.data.length; i++) {
    const change = await fileChecker.find(files.data[i].filename);
    if (change > '') changes.push({ change: `- ${change}` });
  }

  summary += ` ${changes.length} file${changes.length === 1 ? '' : 's'} ${changes.length === 1 ? 'had' : 'have'} impactful changes.`;

  data.requests.push({
    number: prNumber,
    state: prState,
    title: prTitle,
    changes,
    summary,
  });

  await prFileWriter.write(data);
}

main();
