from init_db import ParsedDb
from functions import most_recent
from init_db import ChiSqDb
from vars import TEMPORAL_DATA, CHI_GRAPHS
from ..sanitize.vars import NAME, DEMOGRAPHIC
import rethinkdb as r

RdbMostRecent = most_recent(ParsedDb)
RdbChiSquare = ChiSqDb.table(TEMPORAL_DATA)
RdbChiMerged = ChiSqDb.table(CHI_GRAPHS)

if "eth_income" not in RdbChiSquare.index_list().run():
    RdbChiSquare.index_create("eth_income", [r.row[DEMOGRAPHIC], r.row[NAME]]).run()
    RdbChiSquare.index_wait("eth_income").run()
