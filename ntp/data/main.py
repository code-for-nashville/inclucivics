import time
from pprint import pprint
from ntp.data.init_db import rdb_timestamps, r
from ntp.data import etl, api

def create_timestamps(new_timestamp):
    """
    Insert a new timestamp value into rethinkdb
    """
    rdb_timestamps.insert(dict(id=new_timestamp)).run(r.connect())
    return True


def main(ntp_last_updated):
    """
    Handles all required data manipulations for importing open data portal data

    Takes in an epoch time value representing the last time the open data portal
    data was retrieved.
    """
   
    
    odp_last_updated = api.check_for_update()
   
    # 0 is the initial condition. See ntp.data.api.ntp_last_update()
    if ntp_last_updated == 0 or api.should_update(ntp_last_updated, odp_last_updated):

        if not ntp_last_updated:
            ntp_last_updated = int(time.time())

        # Raw data acquisition and cleaning
        raw_data = api.retrieve_data()
        sanitized_data = etl.return_sanitized(raw_data)
        
        # Actual data transformations needed for front end
        static_data = etl.prepare_static_data(sanitized_data)
        temporal_data = etl.prepare_temporal_data(sanitized_data)
        out_bool = create_timestamps(ntp_last_updated) 
        assert out_bool
        return dict(static=static_data, temporal=temporal_data)

    return False
