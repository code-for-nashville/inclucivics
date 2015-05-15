INCLUCIVICS
==========
![Travis CI Build Status](https://travis-ci.org/code-for-nashville/hrc-employment-diversity-report.svg?branch=master)

INCLUVICS is a data visualization app done in partnership with the Human Relations Commission.  The goal is to provide
transparency into employee demographics at Nashville's Metro Government.

### Requirements:
* Vagrant >= 1.7.2
* VirtualBox >= Latest

### Development Setup:
1. Make sure Vagrant and Virtual Box are installed
2. Clone repo, download `vagrant up`
3. `vagrant ssh` will log you into the VM
4. `cd /vagrant/ntp`
5. `sudo python run_server.py` will add all the incluvics data and launch the python webserver available on localhost:8080

### How To Deploy Changes
1. Make a PR (Pull Request) and get it merged
2. Create a tag with `git tag v#.#`. Replace the #'s with version numbers that are greater (+1) than the largest tag shown on github.
3. Push the newly created tag with `git push --tags`.
4. Wait and have a :coffee:
