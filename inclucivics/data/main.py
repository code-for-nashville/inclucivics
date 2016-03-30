import time

import rethinkdb as r

from . import etl, api
from ..app.include.functions import rdb_conn, LEGACY_DATABASE_NAME


def save_timestamp(new_timestamp):
    """
    Insert a new timestamp value into rethinkdb
    """
    r.db(LEGACY_DATABASE_NAME)\
        .table('timestamps')\
        .insert(dict(id=new_timestamp))\
        .run(rdb_conn())
    return True


def main(inclucivics_last_updated):
    """
    Handles all required data manipulations for importing open data portal data

    Takes in an epoch time value representing the last time the open data portal
    data was retrieved.
    """

    odp_last_updated = api.check_for_update()

    # 0 is the initial condition. See ntp.data.api.inclucivics_last_update()
    if inclucivics_last_updated == 0 or api.should_update(inclucivics_last_updated, odp_last_updated):

        if not inclucivics_last_updated:
            inclucivics_last_updated = int(time.time())

        # Raw data acquisition and cleaning
        raw_data = api.retrieve_data()
        sanitized_data = etl.return_sanitized(raw_data)

        # Actual data transformations needed for front end
        static_data = etl.prepare_static_data(sanitized_data)
        temporal_data = etl.prepare_temporal_data(sanitized_data, odp_last_updated)
        out_bool = save_timestamp(inclucivics_last_updated)
        assert out_bool
        return dict(static=static_data, temporal=temporal_data)

    return False
