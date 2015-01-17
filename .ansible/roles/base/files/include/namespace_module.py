from sys import argv, exit
import os

if len(argv) == 1:
    print "No module name provided, usage: `python %s module_name`" % str(argv[0])
    exit()

MODULE_NAME = argv[1]

if MODULE_NAME.endswith("/") or MODULE_NAME.startswith("/"):
    print "Please enter only the name of the module directory to be created."
    print "Do not add either leading or trailing '/'"
    exit()

if MODULE_NAME not in os.listdir('.'):
    MODULE_HOME = "./%s" % MODULE_NAME
    os.mkdir(MODULE_HOME, 0755)

    VARS = MODULE_HOME + "/vars.py"
    FUNCTIONS = MODULE_HOME + "/functions.py"
    CLASSES = MODULE_HOME + "/classes.py"
    QUERY = MODULE_HOME + "/query_objects.py"

    TO_MAKE = [
        # MODULE_HOME,
        VARS,
        FUNCTIONS,
        CLASSES,
        QUERY
    ]
    for _file in TO_MAKE:
        with open(_file, "w+") as f:
            pass
        f.close()

else:
    print "WARNING: %s already exists..." % MODULE_NAME
    exit()



""""

class NameSpace(object):

    def __init__(self):
        from sys import argv, exit

        if len(argv) == 1:
            print "No args provided, usage: `python %s arg`" % str(argv[0])
            exit()

        self.root = argv[1]

        if self.root.endswith("/") or self.root.startswith("/"):
            print "Please enter only the name of the module directory to be created."
            print "Do not add either leading or trailing '/'"
            exit()

    def create(self, paths):
        import os
        root_directory = "./%s" % self.root

        if self.root not in os.listdir('.'):
            os.mkdir(root_directory, mode=0o77)
        else:
            print "WARNING: %s already exists..." % root_directory
            exit()

        for path in paths:
            path.rstrip("/")
            path_list = path.split("/")

"""