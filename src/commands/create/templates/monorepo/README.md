# Changesets Monorepo

This is a template for a changesets mono repo, you will need to update a few files:

```
.changeset/config.json          # Replace REPO_NAME with your username/repo e.g. ghostdevv/neru
package.json                    # Replace REPO_URL with your repo url e.g. https://github.com/ghostdevv/neru
LICENSE                         # Put your License into here (if not MIT also change package.json)
.github/workflows/release.yml   # Replace REPO_NAME with your username/repo e.g. ghostdevv/neru - also ensure that a NPM_TOKEN secret is added to the repository
```
