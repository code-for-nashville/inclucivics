from setuptools import setup, find_packages
from inclucivics import __version__

setup(
    name='inclucivics',
    version=__version__,
    packages=find_packages(),
    install_requires=['rethinkdb', 'flask', 'cherrypy', 'paste', "requests", "nose", "coverage", "toolz", "pytz"],
    url='https://github.com/code-for-nashville/hrc-employment-diversity-report',
    license='MIT',
    author='neolytics',
    author_email='jstaples@nextgxdx.com',
    description='HR demographics data visualization app for the Nashville Human Relations Commission'
)
