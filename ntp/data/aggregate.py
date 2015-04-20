from include.rethinkdb.tables import RdbTableEmployeesByDepartment, RdbTableRawData
from include.sanitize.vars import CLEAN_SALARY, ETHNICITY, GENDER, EMPLOYEES
from include.aggregate.functions import update_income_level, update_department_by_attribute, most_recent, rdb_group_by_department
from include.aggregate.vars import INCOME_DISTRIBUTIONS


def run():

    if not RdbTableEmployeesByDepartment.count():
        RdbTableEmployeesByDepartment.delete().run()

    update_income_level(
        most_recent(),
        INCOME_DISTRIBUTIONS,
        CLEAN_SALARY
    )

    data = [elem for elem in most_recent().run()]

    all_departments = dict(
        name="All Departments",
        employees=data
    )

    for group in [all_departments, rdb_group_by_department()]:
        RdbTableEmployeesByDepartment.insert(group, conflict="update").run()

    for pair in [("ethnicity", ETHNICITY), ("gender", GENDER)]:
        update_department_by_attribute(RdbTableEmployeesByDepartment, pair[0], pair[1])

    RdbTableEmployeesByDepartment.replace(lambda row: row.without(EMPLOYEES)).run()
