from sys import argv, exit
import os

if len(argv) == 1:
    print "No roll name provided, usage: `python %s roll_name`" % str(argv[0])
    exit()

ROLL_NAME = argv[1]

if ROLL_NAME.endswith("/") or ROLL_NAME.startswith("/"):
    print "Please enter only the name of the roll directory to be created."
    print "Do not add either leading or trailing '/'"
    exit()

EXAMPLE_LOOP = '\n# EXAMPLE LOOP\n\n- name: Install SciPy stack\n\taction: apt name={{item}} state=latest\n\twith_items:\n\t\t- python-scipy\n\t\t- python-sympy\n"""'
EXAMPLE_COMMAND = '"""\n# EXAMPLE SINGLE COMMAND\n\n- name: Install SciPy stack\n\tpip: name=pandas state=latest'

if ROLL_NAME not in os.listdir('.'):
    ROLL_HOME = "./%s" % ROLL_NAME
    FILES = ROLL_HOME + "/files"
    TASKS = ROLL_HOME + "/tasks"
    INCLUDE = FILES + "/include"
    SCRIPTS = FILES + "/scripts"

    TO_MAKE = [
        ROLL_HOME,
        FILES,
        TASKS,
        INCLUDE,
        SCRIPTS
    ]
    for directory in TO_MAKE:
        os.mkdir(directory, 0755)

    MAIN = TASKS + "/main.yml"

    with open(MAIN, "w+") as f:
        f.write("---\n\n")
        f.write(EXAMPLE_COMMAND + "\n\n")
        f.write(EXAMPLE_LOOP)

    f.close()

else:
    print "WARNING: %s already exists..." % ROLL_NAME
    exit()