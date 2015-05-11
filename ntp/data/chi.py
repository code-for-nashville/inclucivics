from ntp.project.common.helpers import merge_json_like, sortDict, concat_values
from include.rethinkdb.tables import RdbChiSquare, RdbChiMerged
from include.aggregate.vars import KEYS
import rethinkdb as r


def run():
    names = RdbChiSquare.map(lambda row: row["name"]).distinct().run()

    for key in KEYS:
        val = [merge_json_like(RdbChiSquare.get_all([key, name], index="eth_income").order_by(r.asc("axis")).run()) for name in names]
        for item in val:
            item["name"] = item["name"][0]
            del item["id"]
            RdbChiMerged.insert({"id": key, "series": val, "axis": val[0]["axis"]}, conflict="replace").run()

