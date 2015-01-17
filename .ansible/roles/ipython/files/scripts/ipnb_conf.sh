#!/bin/bash

yes US | openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout ~/.ssh/cert.pem -out ~/.ssh/cert.pem
ipython profile create default

mkdir -p /home/vagrant/.temp

cd ~
echo "if [ -f /home/vagrant/.temp/ipnb_pass.py ] && [ -f /home/vagrant/.temp/ipynb_auth.sh ]; then
  bash /home/vagrant/.temp/ipynb_auth.sh
fi" >> .bashrc
