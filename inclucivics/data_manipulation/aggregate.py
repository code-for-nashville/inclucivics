from include.rethinkdb.tables import RdbTableEmployeesByDepartment, RdbTableRawData
from include.sanitize.vars import CLEAN_SALARY, ETHNICITY, GENDER
from include.aggregate.queries import RdbGroupByDepartment
from include.aggregate.functions import update_income_level, update_department_by_attribute
from include.aggregate.vars import INCOME_DISTRIBUTIONS


update_income_level(
    RdbTableRawData,
    INCOME_DISTRIBUTIONS,
    CLEAN_SALARY
)

ALL_DEPARTMENTS = dict(
    name="all_departments",
    employees=[
        elem
        for
        elem in
        RdbTableRawData.run()
    ]
)

RdbTableEmployeesByDepartment.insert(
    ALL_DEPARTMENTS
).run()

RdbTableEmployeesByDepartment.insert(
    RdbGroupByDepartment,
    conflict="replace"
).run()

update_department_by_attribute(
    RdbTableEmployeesByDepartment,
    "ethnicity",
    ETHNICITY
)

update_department_by_attribute(
    RdbTableEmployeesByDepartment,
    "gender",
    GENDER
)

