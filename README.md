# gh-find-current-pr

This action tries to figure out the current PR.

If the event is a `pull_request`, it's very easy to get the current PR number
from the context via `${{ github.event.number }}`, but unfortunately this
information does not seem to be readily available for a `push` event.  This
action sends a request to GitHub to find the PR associated with the current SHA or merged branch,
and returns its number in the `number` output. `number` will be an empty string if there is no
PR.

Additionally, `title`, `body` and `labels` outputs are available as well to get the respective title, body and labels of the PR.

## Usage

```yaml
    steps:
      - uses: actions/checkout@v2
      # Find the PR associated with this push, either with current commit or merged branch.
      - uses: finfo/gh-find-current-pr@master
        id: findPr
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
      # This will echo "Your PR number is 7", or be skipped if there is no current PR.
      - run: echo "Your PR number is ${PR_Number}"
        if: success() && steps.findPr.outputs.number
        env:
          PR_Number: ${{ steps.findPr.outputs.number }}
```
