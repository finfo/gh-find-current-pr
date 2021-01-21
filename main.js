const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function main() {
    const token = core.getInput('github-token', { required: true });
    const sha = core.getInput('sha');
    const client = new GitHub(token, {});
    let pr;

    pr = await getPullRequestByCommit(client, context, sha);
    if (pr === undefined) {
        const response = await client.repos.getCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: sha || context.sha
        });
        const currentCommit = response.data;
        const mergedAncestorCommit = currentCommit.parents[1];
        if (mergedAncestorCommit) {
            pr = await getPullRequestByCommit(client, context, mergedAncestorCommit.sha);
        }
    }
    core.setOutput('number', pr && pr.number || '');
    core.setOutput('title', pr && pr.title || '');
    core.setOutput('body', pr && pr.body || '');
    core.setOutput('labels', pr && pr.labels.map(l => l.name).join('\n') || '');
}

async function getPullRequestByCommit(client, context, sha) {
    const response = await client.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha || context.sha
    });
    if (response.data.length > 0 && response.data[0]) { return response.data[0]; }
}

main().catch(err => core.setFailed(err.message));
