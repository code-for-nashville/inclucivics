from IPython.lib import passwd


print "Configure IPython notebook password."
temp = passwd()

f = open('cred.txt', 'w')
f.write(temp)
f.close()
