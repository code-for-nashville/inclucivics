import rethinkdb as r
from ..sanitize.vars import DEPARTMENT, NAME, EMPLOYEES
from functions import most_recent

# RdbGroupByDepartment = most_recent()\
#     .group(DEPARTMENT)\
#     .ungroup()\
#     .merge(
#         {
#             NAME: r.row["group"],
#             EMPLOYEES: r.row["reduction"]
#         }
#     )\
#     .without(
#         [
#             "group",
#             "reduction"
#         ]
#     )



