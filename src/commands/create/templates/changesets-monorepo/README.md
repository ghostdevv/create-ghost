# Changesets Monorepo

Personal notes: internal pacakges should be scoped and have `private: true` in your package.json

1. Update configs

    1. Add your License text to the `LICENSE` file. If you're unsure then checkout the [MIT license](https://choosealicense.com/licenses/mit/).
    2. Search and replace the template `REPO_NAME` with your username/repo. e.g. `ghostdevv/neru`

2. Add the [changeset bot](https://github.com/apps/changeset-bot) to your repo

3. Set the workflow permissions

    Go to `https://github.com/REPO_NAME/settings/actions`, the "Workflow permissions" section should look like this:

    ![](https://i.imgur.com/hQqJtHF.png)

3. Add the `NPM_TOKEN`

    You can create a token on `https://www.npmjs.com/settings/NPM_USERNAME/tokens`, we can't create a granular token until the package has been published for the first time. So you can create a classic token for now. You should then add it as a "Repository secret" here: `https://github.com/REPO_NAME/settings/secrets/actions`
