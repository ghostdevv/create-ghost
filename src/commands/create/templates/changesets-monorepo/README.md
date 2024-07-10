# Changesets Monorepo

Personal notes: internal pacakges should be scoped and have `private: true` in your package.json

1. Update configs

    1. Add your License text to the `LICENSE` file. If you're unsure then checkout the [MIT license](https://choosealicense.com/licenses/mit/).
    2. Search and replace the template `REPO_NAME` with your username/repo. e.g. `ghostdevv/neru`

2. Add the [changeset bot](https://github.com/apps/changeset-bot) to your repo. You add your new monorepo by selecting under "Repository access" > "Only select repositories" > "Select repositories". Don't forget to hit save.

    ![](https://i.imgur.com/5bz4hez.png)

3. Set the workflow permissions

    Go to `https://github.com/REPO_NAME/settings/actions`, the "Workflow permissions" section should look like this:

    ![](https://i.imgur.com/hQqJtHF.png)

3. Create & Save a `NPM_TOKEN`

    1. Visit [npm](https://www.npmjs.com) and navigate to "Access Tokens"

        ![](https://i.imgur.com/cJGMQ2c.png)

    2. If you've published your package before you can create a "Granular access token", otherwise select "Classic". If you chose classic try not to forget to come back later and change it to a granular one, and delete your classic token. Not a big deal if you forget though!

        The expiration date can be some distant date in the future, whatever it lets you. You don't need to save this anywhere other than in step 3.3 (next).

        You can select your package under "Packages and scopes". It should look something like this if you've selected granular access token:

        ![](https://i.imgur.com/KrOcJAg.png)

    3. Navigate to your repository secrets page: `https://github.com/REPO_NAME/settings/secrets/actions`. You can then create a new one called `NPM_TOKEN` and paste it in.

        ![](blob:https://imgur.com/69a949cf-e04c-4429-a932-2b09b50fdc2e)

