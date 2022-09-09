## Deployment Reporting

### Requirements
* Node 12+
* Go to your [Developer Settings page in GitHub](https://github.com/settings/tokens) and generate a new Personal access token. Set up an environment variable for that token value:
  * name - API_TOKEN
  * value - \<your api token\>

### Generate a report

Set the milestone in main.js, i.e.
```
const milestone = '20.7';
```
run main.js using node.
```
$ node main.js
```

### View the report

The report will be written to the output folder using the milestone as the markdown file name, i.e.
```
output/20.7.md
```

### Notes

I’m wanting to stand up a couple of API endpoints to handle webhooks for Github and Teamcity.

Two use cases for it so far:
Automating the deployment issue updates ("should we deploy agent? What commit/build number? Are there DB changes?")
Writing out some sort of report that says "Hey, this changed in this PR…make sure you test THAT too"

Basically, for any given release, I want to be able to pull up a page that gives me the run down.

I’m thinking we could have something like…

Product => file pattern
  "Area/Feature" => file pattern

So if a PR gets merged that changes files that match a pattern, we can say "Hey, this thing changed"


I think we would need to push that to Kinesis first and then process that "event stream" with "event handlers" (lambdas) so that we get retries and we can control the timeouts.
# deployment
