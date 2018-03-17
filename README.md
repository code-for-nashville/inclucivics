# IncluCivics

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/code-for-nashville/inclucivics.svg?branch=master)](https://travis-ci.org/code-for-nashville/inclucivics)

[IncluCivics](https://code-for-nashville.github.io/inclucivics) is a data visualization app completed in partnership with the Human Relations Commission.  It provides transparency on employee demographics within the Nashville Metropolitan Government.

## Running
To run, make sure you have [`yarn` installed](https://yarnpkg.com/en/docs/install), and run

`yarn install && yarn start`

to see the site live at http://localhost:3000.

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app). Check out the [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for more information about testing and building.

## Infrastructure
Infrastructure is managed in this repository.  The IncluCivics site is deployed to Github Pages, but it relies on a process encapsulated in the [`terraform`](terraform/) directory to fetch and process employee demographic data.  To learn more about running and testing this process, see the [infrastructure README](terraform/README.md)

## Deploying
Run `yarn deploy` to deploy the website. This will fail if you don't have push rights to the repository's `gh-pages` branch.

## Contributing
Contributions are welcome. Look at the "Issues" tab to squash :bug:s, add features and suggest improvements. If you are new to open source, check out [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/) for a rundown.

## License
[MIT](LICENSE.md)
