const { request } = require('@octokit/request');
const fileChecker = require('./FileChecker');
const requestDefaults = require('../defaults');
requestDefaults.headers.authorization = `token ${process.env.API_TOKEN}`;

const requestWithAuth = request.defaults(requestDefaults);

async function getData(pr, data, milestone) {
  if (pr.milestone && pr.milestone.title === milestone) {
    const files = await requestWithAuth('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', { pull_number: pr.number });
    let summary = `${files.data.length === 1 ? 'There is' : 'There are'} ${files.data.length} file change${files.data.length === 1 ? '' : 's'}.`;

    const changes = [];
    for (let i = 0; i < files.data.length; i++) {
      const change = await fileChecker.find(files.data[i].filename);
      if (change > '') changes.push({ change: `- ${change}` });
    }

    summary += ` ${changes.length} file${changes.length === 1 ? '' : 's'} ${changes.length === 1 ? 'had' : 'have'} impactful changes.`;

    data.requests.push({
      number: pr.number,
      state: pr.state,
      title: pr.title,
      changes,
      summary,
    });
  }
}

class PullChecker {
  async check(pr, data, milestone) {
    await getData(pr, data, milestone);
  }
}

module.exports = new PullChecker();
