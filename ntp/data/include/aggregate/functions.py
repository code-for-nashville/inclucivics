import rethinkdb as r
from ..sanitize.vars import DEPARTMENT, NAME, EMPLOYEES
from scipy.stats import chisquare
from copy import deepcopy

eth_iter = lambda tuple_array: [elem[0] for elem in tuple_array]


def expected_and_observed(aggregations, expected, keys):
    aggs = deepcopy(aggregations)

    for demographic in keys:
        for income_bracket in aggs[demographic]:
            total = sum(elem[1] for elem in income_bracket["data"])
            #
            # missing = [elem for elem in expected[demographic] if elem not in eth_iter(income_bracket["data"])]
            #
            # if missing:
            #     for field in missing:
            #         income_bracket["data"].append([field, 0])

            for data_point in income_bracket["data"]:
                if data_point[0] in expected[demographic]:
                    data_point.append(total * expected[demographic][data_point[0]])

            income_bracket["data"] = sorted(income_bracket["data"])
            income_bracket["observed"] = [elem[1] for elem in income_bracket["data"] if elem[0] in expected[demographic]]
            income_bracket["expected"] = [elem[2] for elem in income_bracket["data"] if elem[0] in expected[demographic]]
            income_bracket["chi_sq"] = chisquare(income_bracket["observed"], income_bracket["expected"])

    return aggs


def chi_parser(aggs, keys):
    return {key: [{"data": elem["chi_sq"][0], "name": elem["income_level"]} for elem in aggs[key]] for key in keys}


def group_by_department(TblObject):

    return TblObject \
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

