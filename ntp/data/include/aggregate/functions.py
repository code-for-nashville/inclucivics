import rethinkdb as r
from ..rethinkdb.init_db import RawDb
from ..sanitize.vars import DEPARTMENT, NAME, EMPLOYEES


def most_recent():
    out = [elem for elem in RawDb.table_list().run()]

    if out:
        return RawDb.table(out[-1])
    from sys import exit
    print "No imported data found."
    exit()


def rdb_group_by_department():

    return most_recent() \
        .group(DEPARTMENT) \
        .ungroup() \
        .merge(
        {
            NAME: r.row["group"],
            EMPLOYEES: r.row["reduction"]
        }
    ) \
        .without(
        [
            "group",
            "reduction"
        ]
    )


def update_income_level(table_object, income_distributions, index):
    from .vars import INCOME_KEY

    for key, value in income_distributions.items():
        table_object.between(
            value["lower"],
            value["upper"],
            index=index
        )\
        .update(
            {
                INCOME_KEY: key
            }
        )\
        .run()


def update_department_by_attribute(table_object, key_name, attribute):
    from .vars import INCOME_KEY
    from ..sanitize.vars import EMPLOYEES

    table_object\
        .update(
            lambda row:
                {
                    key_name: row[EMPLOYEES]
                    .group(INCOME_KEY)
                    .ungroup()
                    .map(
                        lambda group:
                        {
                            "type": "pie",
                            "income_level": group["group"],
                            "data": group["reduction"]
                            .group(attribute)
                            .count()
                            .ungroup()
                            .order_by(
                                r.desc(
                                    lambda order: order["reduction"]
                                )
                            )
                            .map(
                                lambda data:
                                    [
                                        data["group"],
                                        data["reduction"]
                                    ]
                            )
                        }
                    )
                }
        )\
        .run()

