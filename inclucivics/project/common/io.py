import pandas as pd
import json


def write_json(path, name, indent=0, encoding="utf-8"):
    with open(path, 'w+') as json_file:
        json_file.write(json.dumps(name, encoding=encoding, indent=indent))
    return "JSON written to %s" % (path)


def load_json(path, encoding="utf-8"):
    with open(path) as json_file:
        name = json.load(json_file, encoding=encoding)
        json_file.close()
    return name


def load_csv(path, sep=",", encoding="utf-8"):
    data = pd.read_csv(path, sep=sep, encoding=encoding)
    return data


def write_csv(path, name, sep="|", encoding="utf-8"):
    name.to_csv(path, sep, encoding=encoding)
    return "CSV written to %s" % path


def rethink_import_data(files_to_import, file_type="json", delimitter=","):
    from os import system, listdir

    extension = file_type
    """
    if extension != "json" and file_type == "csv":
        extension = "csv"

    else:
        print "Only 'json' or 'csv' file_types accepted as params. got %s" % file_type
        return
    """
    if extension == "csv":
        import_command = "rethinkdb import -c localhost:28015 --table %s -f %s/%s --force --format %s %s> /dev/null"

    else:
        import_command = "rethinkdb import -c localhost:28015 --table %s -f %s/%s --force --format %s > /dev/null"

    for file_object in files_to_import:
        file_directory = listdir(file_object['path'])
        for file_name in file_directory:

            if file_name.endswith(extension):

                if not file_name.startswith('.'):
                    if extension == "csv":
                        print "yes"
                        delimit = "--delimiter '%s'" % delimitter
                        print delimit
                        command = import_command % (
                            file_object['table'],
                            file_object['path'],
                            file_name,
                            extension,
                            delimit
                        )
                    else:
                        command = import_command % (
                            file_object['table'],
                            file_object['path'],
                            file_name,
                            extension
                        )

                    system(command)


def rethink_export_data(files_to_export):
    from os import system
    export_command = "rethinkdb export -e %s -d %s > /dev/null"
    for file_object in files_to_export:
        command = export_command % (file_object['table'], file_object['path'])
        system(command)