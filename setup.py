from distutils.core import setup

setup(
    name='inclucivics',
    version='0.0.1',
    packages=['ntp', 'ntp.app', 'ntp.app.include', 'ntp.data', 'ntp.data.include', 'ntp.data.include.sanitize',
              'ntp.data.include.aggregate', 'ntp.data.include.rethinkdb', 'ntp.project', 'ntp.project.common',
              'ntp.project.cherrypy', 'ntp.project.rethinkdb', 'ntp.project.elasticsearch'],
    url='https://github.com/code-for-nashville/hrc-employment-diversity-report',
    license='',
    author='neolytics',
    author_email='jstaples@nextgxdx.com',
    description=''
)
