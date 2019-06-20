# IncluCivics

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/code-for-nashville/inclucivics.svg?branch=master)](https://travis-ci.org/code-for-nashville/inclucivics)

[IncluCivics](https://code-for-nashville.github.io/inclucivics) is a data visualization app completed in partnership with the Human Relations Commission.  It provides transparency on employee demographics within the Nashville Metropolitan Government.

## Running
To run, make sure you have [`yarn` installed](https://yarnpkg.com/en/docs/install), and run

`yarn install && yarn start`

to see the site live at http://localhost:3000.

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app). Check out the [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for more information about testing and building.

## Adding Data
To add data:

1. Run `yarn data:fetch` to download the latest file to the `input/` directory.
2. Run `yarn data:import`. This will produce new files in `public/data/` that will be used in the Explore section of the grahps. _Note:_ The import may fail because of changes to column names or data format. If you encouter a failure, please [file an issue](https://github.com/code-for-nashville/inclucivics/issues/new) :writing_hand:.  This will also generate a summary of all files in the `input/` directory
4. Commit any changes and submit a pull request.

## Deploying
Run `yarn deploy`. This will fail if you don't have push rights to the repository's `gh-pages` branch. The app is configured to use git over https. If you have two-factor authentication to github, you will need to create a [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with the 'public_repo' permission.

## Contributing
Contributions are welcome. Look at the "Issues" tab to squash :bug:s, add features and suggest improvements. If you are new to open source, check out [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/) for a rundown.

## License
[MIT](LICENSE.md)
