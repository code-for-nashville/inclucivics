# IncluCivics

[IncluCivics](https://code-for-nashville.github.io/inclucivics) is a data visualization app completed in partnership with the Human Relations Commission.  It provides transparency on employee demographics within the Nashville Metropolitan Government.

## Running
To run, make sure you have [`yarn` installed](https://yarnpkg.com/en/docs/install), and run

`yarn start`

to see the site live at http://localhost:3000.

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app). Check out the [User Guide]() for more information about testing and building.

## Adding Data
Adding data is still a manual process. Help is wanted [automating this process](). To add data:

1. Download the latest version of [General Government Employees Demographics](https://data.nashville.gov/General-Government/General-Government-Employees-Demographics/4ibi-mxs4) from the [Nashville Open Data Portal](data.nashville.gov). Make sure that this data is a more recent update that the latest data in [data/](data)
2. Copy the data into the [data/](data) folder.
3. Run `python import_data data/<your_file>`. 🤞 It may fail, in which case please file an issue or try to fix the problem. If successful, this will generate a new `public/department_rollups.json`.
4. Commit any changes and submit a pull request.

This will update the data in "Custom Reports" to the report you downloaded.  Note that ["Summary of Demographics Over Time" does not include new data right now](https://github.com/code-for-nashville/inclucivics/issues/108).

## Deploying
Run `yarn deploy`. This will fail if you don't have push rights to the repository's `gh-pages` branch.

## Contributing
Contributions are welcome. Look at the "Issues" tab to squash :bug:s, add features and suggest improvements. If you are new to open source, check out [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/) for a rundown.

## License
[MIT](LICENSE.md)
