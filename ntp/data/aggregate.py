from ntp.project.common.helpers import merge_json_like, sortDict
from include.rethinkdb.vars import NAME
from include.rethinkdb.init_db import RawDb, ParsedDb
from include.rethinkdb.tables import RdbChiSquare, RdbChiMerged
from include.rethinkdb.functions import aggregates, tbl_dict
from include.sanitize.vars import CLEAN_SALARY, ETHNICITY, GENDER, EMPLOYEES
from include.aggregate.vars import INCOME_DISTRIBUTIONS, EXPECTED, KEYS
from include.aggregate.functions import (
    update_income_level, update_department_by_attribute,
    group_by_department, expected_and_observed, chi_parser
)


def run():

    raw_tables = tbl_dict(RawDb)
    parsed_tables = ParsedDb.table_list().run()

    for tbl_name in raw_tables:
        if tbl_name not in parsed_tables:

            ParsedDb.table_create(tbl_name).run()
            ParsedDb.table(tbl_name).index_create(NAME).run()
            ParsedDb.table(tbl_name).index_wait().run()

            CurrentParsedTableObject = ParsedDb.table(tbl_name)
            CurrentRawTableObject = raw_tables[tbl_name]

            update_income_level(
                CurrentRawTableObject,
                INCOME_DISTRIBUTIONS,
                CLEAN_SALARY
            )

            data = [elem for elem in CurrentRawTableObject.run()]

            all_departments = dict(
                name="All Departments",
                employees=data
            )

            for group in [all_departments, group_by_department(CurrentRawTableObject)]:
                CurrentParsedTableObject.insert(group, conflict="update").run()

            for pair in [("ethnicity", ETHNICITY), ("gender", GENDER)]:
                update_department_by_attribute(CurrentParsedTableObject, pair[0], pair[1])

            CurrentParsedTableObject.replace(lambda row: row.without(EMPLOYEES)).run()

            aggs = aggregates(CurrentParsedTableObject)
            chi_data = expected_and_observed(aggs, EXPECTED, KEYS)
            chi_parsed = chi_parser(chi_data, KEYS)

            for key in KEYS:
                for bracket in chi_parsed[key]:
                    bracket.update({"axis": tbl_name, "demographic": key})
                    RdbChiSquare.insert(bracket).run()


#
# aggs = aggregates(ParsedDb.table("20150419"))
#
# from pprint import pprint
# pprint(chi_parser(expected_and_observed(aggs, EXPECTED, KEYS), KEYS))
#
# names = RdbChiSquare.map(lambda row: row["name"]).distinct().run()
# names = [elem for elem in RdbChiSquare.run()]
# print names
#
# for key in KEYS:
#     for name in names:
#         print merge_json_like(RdbChiSquare.get_all([key, name], index="eth_income")).run()
#

