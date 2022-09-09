const { request } = require('@octokit/request');
const fileWriter = require('./src/fileWriter');
const pullChecker = require('./src/PullChecker');
const requestDefaults = require('./defaults');
requestDefaults.headers.authorization = `token ${process.env.API_TOKEN}`;

const requestWithAuth = request.defaults(requestDefaults);

const milestone = '2022.5';
let milestoneNumber = 0;
// const milestone = '20.6.0.rc-2';

const data = {
  milestone,
  requests: [],
};

async function main() {
  // const getMilestones = await requestWithAuth('GET /repos/{owner}/{repo}/milestones', { state: 'open' });
  // const ms = getMilestones.data;
  // for (let i = 0; i < ms.length; i++) {
  //   const m = ms[i];
  //   if (m.title == milestone) milestoneNumber = m.number;
  // }

  // const getIssues = await requestWithAuth('GET /repos/{owner}/{repo}/issues', { milestone: milestoneNumber, per_page: 100, sort: 'number' });
  // const issues = getIssues.data;;
  // for (let i = 0; i < issues.length; i++) {
  //   const issue = issues[i];
  //   console.log(issue)
  // }

  const pulls = await requestWithAuth('GET /repos/{owner}/{repo}/pulls', { state: 'all' });

  for (let i = 0; i < pulls.data.length; i++) {
    const pr = pulls.data[i];
    console.log(pr.number)
    await pullChecker.check(pr, data, milestone);
  }

  await fileWriter.write(data);
}

main();
