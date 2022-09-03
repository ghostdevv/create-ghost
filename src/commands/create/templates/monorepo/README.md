# Changesets Monorepo

1. Update configs

    | File                            | Step                                                                            |
    |---------------------------------|---------------------------------------------------------------------------------|
    | .changeset/config.json          | Replace REPO_NAME with your username/repo e.g. ghostdevv/neru                   |   
    | package.json                    | Replace REPO_URL with your repo url e.g. https://github.com/ghostdevv/neru      |
    | LICENSE                         | Put your License into here (if not MIT also change package.json)                |
    | .github/workflows/release.yml   | Replace REPO_NAME with your username/repo e.g. ghostdevv/neru                   |

2. Add changeset bot to repo

    https://github.com/apps/changeset-bot

3. Secrets

    Add `NPM_TOKEN` to github action secrets