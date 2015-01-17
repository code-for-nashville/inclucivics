#!/bin/bash

#Download virtualbox
echo "Downloading virtualbox"
curl -O -L http://download.virtualbox.org/virtualbox/4.3.20/VirtualBox-4.3.20-96996-OSX.dmg

#Download vagrant
echo "Downloading Vagrant"
curl -O -L https://dl.bintray.com/mitchellh/vagrant/vagrant_1.6.5.dmg

# Download homebrew
echo "Installing homebrew"
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Brew up some ansible using homebrew
echo "Installing ansible"
brew install ansible

echo "Super awesomeness"