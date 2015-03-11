VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.provider "virtualbox" do |vb|
    config.vm.box = 'jstaples/base'
    config.vm.network "forwarded_port", guest: 8080, host: 8081
     config.vm.network "forwarded_port", guest: 80, host: 8080
    config.ssh.forward_agent = true
    vb.memory = 1024
    vb.cpus = 1
  end
    config.vm.provision "shell", inline: <<-SHELL
      cd /vagrant
      sudo python setup.py install
   SHELL
end

