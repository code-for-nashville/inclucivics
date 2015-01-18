import rethinkdb as r
from ..rethinkdb.tables import RdbTableRawData
from ..sanitize.vars import DEPARTMENT, NAME, EMPLOYEES



RdbGroupByDepartment = RdbTableRawData\
    .group(DEPARTMENT)\
    .ungroup()\
    .merge(
        {
            NAME: r.row["group"],
            EMPLOYEES: r.row["reduction"]
        }
    )\
    .without(
        [
            "group",
            "reduction"
        ]
    )



