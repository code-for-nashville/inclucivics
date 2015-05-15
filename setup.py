from setuptools import setup

setup(
    name='Inclucivics',
    version='3.1.3',
    packages=['ntp', 'ntp.app', 'ntp.app.include', 'ntp.data', 'ntp.data.include', 'ntp.data.include.sanitize',
              'ntp.data.include.aggregate', 'ntp.data.include.rethinkdb', 'ntp.project', 'ntp.project.common',
              'ntp.project.cherrypy', 'ntp.project.rethinkdb', 'ntp.project.elasticsearch'],
    install_requires=['rethinkdb', 'flask', 'cherrypy', 'paste', 'scipy'],
    url='https://github.com/code-for-nashville/hrc-employment-diversity-report',
    license='',
    author='neolytics',
    author_email='jstaples@nextgxdx.com',
    description='HR demographics data visualization app for the Nashville Human Relations Commission'
)
