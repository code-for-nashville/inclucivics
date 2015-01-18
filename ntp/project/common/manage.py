

def run_all(work_flow, global_status):
    from os import sys, path
    from sys import exit, stdout
    from subprocess import check_output
    # sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    for script in work_flow:

        command = ["python", script]
        status = check_output(command)
        if status != global_status:
            print "STATUS FAIL: %s" % script
            print "stdout: %s" % status
            exit()
        stdout.flush()
        stdout.write(status)