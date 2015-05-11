__author__ = 'neolytics'
from ..sanitize.vars import ETHNICITY


def tbl_dict(DbObject):
    out = [elem for elem in DbObject.table_list().run()]
    assert out, "%s error, No data returned" % __name__
    return {tbl_name: DbObject.table(tbl_name) for tbl_name in out}


def return_table_objs(DbObject):
    return [DbObject.table(elem) for elem in DbObject.table_list().run()]


def most_recent(DbObject):
    out = return_table_objs(DbObject)
    if out:
        return out[-1]


def all_ethnicity(TblObject):
    data = TblObject.map(lambda row: row[ETHNICITY]).distinct().run()
    assert data, "%s error, No data returned" % __name__
    return data


def aggregates(TblObject):
    data = [elem for elem in TblObject.get_all("All Departments", index="name").run()]
    assert len(data) == 1, "%s return error. got value != 1 for All Departments get_all. This shouldn't happen." % __name__
    return data[0]
