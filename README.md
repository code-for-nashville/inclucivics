INCLUCIVICS
==========

INCLUVICS is a data visualization app done in partnership with the Human Relations Commission.  The goal is to provide
transparency into employee demographics at Nashville's Metro Government.

### Requirements:
* Vagrant >= 1.7.2
* VirtualBox >= Latest

### Setup:
1. Make sure Vagrant and Virtual Box are installed
2. Clone repo, download `vagrant up`
3. `vagrant ssh` will log you into the VM
4. `cd /vagrant/ntp`
5. `sudo python run_server.py` will add all the incluvics data and launch the python webserver available on localhost:8080