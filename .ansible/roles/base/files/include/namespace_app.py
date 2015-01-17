from sys import argv, exit
import os

if len(argv)==1:
    print "No app name provided, usage: `python %s application_name`" % str(argv[0])
    exit()


APP_NAME = argv[1]

if APP_NAME.endswith("/") or APP_NAME.startswith("/"):
    print "Please enter only the name of the application directory to be created."
    print "Do not add either leading or trailing '/'"
    exit()

if APP_NAME not in os.listdir('.'):
    APP_HOME = "./%s" % APP_NAME
    FILES = APP_HOME + "/files"
    INPUT = FILES + "/files"
    OUTPUT = FILES + "/output"
    INCLUDE = APP_HOME + "/include"

    TO_MAKE = [
        APP_HOME,
        FILES,
        INPUT,
        OUTPUT,
        INCLUDE
    ]
    for directory in TO_MAKE:
        os.mkdir(directory, 0755)

else:
    print "WARNING: %s already exists..." % APP_NAME
    exit()