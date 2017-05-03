INCLUCIVICS
==========
![Travis CI Build Status](https://travis-ci.org/code-for-nashville/hrc-employment-diversity-report.svg?branch=master)

INCLUVICS is a data visualization app done in partnership with the Human Relations Commission.  The goal is to provide
transparency into employee demographics at Nashville's Metro Government.

### Development Setup:
Make sure you have [Docker](https://www.docker.com/) installed for your platform. Inside of your clone of this repository

```bash
docker-compose up
```

Navigate to http://localhost:8000 to see the app up and running.

### How To Deploy Changes
1. Make a PR (Pull Request) and get it merged
2. Create a tag with `git tag v#.#`. Replace the #'s with version numbers that are greater (+1) than the largest tag shown on github.
3. Push the newly created tag with `git push --tags`.
4. Wait and have a :coffee:
