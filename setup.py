from setuptools import setup

setup(
    name='Inclucivics',
    version='3.1.4',
    packages=[
        'ntp', 
        'ntp.app', 
        'ntp.data' 
    ],
    install_requires=['rethinkdb', 'flask', 'cherrypy', 'paste', 
        "celery"],
    url='https://github.com/code-for-nashville/hrc-employment-diversity-report',
    license='',
    author='neolytics',
    author_email='jstaples@nextgxdx.com',
    description='HR demographics data visualization app for the Nashville Human Relations Commission'
)
