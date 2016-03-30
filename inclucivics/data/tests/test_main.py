import time
import rethinkdb as r
from ntp.data.init_db import db_name
from ntp.data import main
from pprint import pprint


def test_main():
    """
    Tests primary data acquisition API
    """

    # Zero is the initial condition for main, where there are no existing timestamps to compare against
    out = main.main(0)
    pprint(out)
    assert out
    assert isinstance(out, dict)
    assert all(isinstance(out[elem], list) for elem in out)
    assert all(out[key] for key in out)

    must_fail = int(time.time())
    failing = main.main(must_fail)
    assert not failing
    assert isinstance(failing, bool)
    r.db_drop(db_name).run(r.connect())
