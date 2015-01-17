
c = get_config()

# Kernel config
c.IPKernelApp.pylab = 'inline'  # if you want plotting support always

# Notebook config
c.NotebookApp.profile = 'default'

c.NotebookApp.certfile = '/home/vagrant/.ssh/cert.pem'
c.NotebookApp.ip = '*'
c.NotebookApp.notebook_dir = '/vagrant/project'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 8888
