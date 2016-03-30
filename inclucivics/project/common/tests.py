STATUS = "OBKB1\n"


class DatabaseCheck(object):

    def __init__(self, status):
        self._pass = status
        self.fail = "No data found in required table(s)."

    @staticmethod
    def get_file_name():
        from sys import argv
        name = argv[0]
        return name

    def check_table_for_data(self, table):
        from sys import exit, stdout

        iterator = table

        if not isinstance(table, list):
            iterator = list()
            iterator.append(table)

        for table_object in iterator:
            # name = self.get_file_name()
            counts = table_object.count().run()

            if counts == 0:
                print self.fail
                exit()
            else:
                pass

    def status_out(self):
        from sys import stdout
        return stdout.write(self._pass)


CheckBase = DatabaseCheck(STATUS)
CheckIfDataExistsInTable = CheckBase.check_table_for_data
CheckPointPass = CheckBase.status_out


class ObjectAssertions(object):

    def __init__(self):
        pass

    @staticmethod
    def check_list(list_object, item_type, length=None):

        assert isinstance(list_object, list) or isinstance(list_object, tuple), \
            "Object is not list or type"

        assert list_object,\
            "List or tuple is empty"

        assert isinstance(list_object[0], item_type), \
            "First item is not expected: %s" % (
                item_type
        )

        if length:
            assert len(list_object) == length, \
                "Expected length '%s' does not match: %s" % (
                    length,
                    len(list_object)
            )

        pass

    @staticmethod
    def check_dict(dict_object, length=None, has_keys=None):

        assert isinstance(dict_object, dict), \
            "Object is not dict"

        assert dict_object, \
            "Dict is empty."

        if length:
            assert len(dict_object) == length, \
                "Expected length '%s' does not match: %s" % (
                    length,
                    len(dict_object)
            )

        if has_keys and (isinstance(has_keys, list) or isinstance(has_keys, tuple)):
            for key in has_keys:
                assert key in dict_object.keys(), \
                    "Required key not found: '%s'" % key

        pass

Base = ObjectAssertions()
AssertListExpectations = Base.check_list
AssertDictExpectations = Base.check_dict