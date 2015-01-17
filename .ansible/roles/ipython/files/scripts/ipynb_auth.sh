#!/bin/bash

cd ~/.temp
python ipnb_pass.py

if [ -f cred.txt ]; then
pass="`cat cred.txt`"

cat > /home/vagrant/.ipython/profile_default/ipython_notebook_config.py << EOF

c = get_config()
# Kernel config
c.IPKernelApp.pylab = 'inline'  # if you want plotting support always
# Notebook config
c.NotebookApp.profile = 'default'
c.NotebookApp.certfile = '/home/vagrant/.ssh/cert.pem'
c.NotebookApp.ip = '*'
c.NotebookApp.password = u"$pass"
c.NotebookApp.notebook_dir = '/vagrant/project'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 8888
EOF
cd ..
rm -rf .temp
else
bash ipynb_auth.sh
fi
