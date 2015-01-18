

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

    table_object.replace(
        lambda row:
        row.without(EMPLOYEES)
    ).run()

