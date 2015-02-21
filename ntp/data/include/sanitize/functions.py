import csv


def lazy_read(csvfile, delimiter=",", header=True):
    if header:
        with open(csvfile) as data:
            reader = csv.DictReader(data, delimiter=delimiter)
            for row in reader:
                yield row
    else:
        with open(csvfile) as data:
            reader = csv.reader(data)
            for row in reader:
                yield row