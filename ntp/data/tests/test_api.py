from ntp.data import api


#def test_false():
#    assert False


def test_check_for_update():
    """
    Confirm we are able to retrieve a timestamp from the ODP
    """
    timestamp = api.check_for_update()
    assert timestamp
    assert isinstance(timestamp, int)
    assert int(timestamp)
    assert len(str(timestamp)) >= 10
    return int(timestamp)


def test_should_update():
    """
    Ensure that we get appropriate boolean values for whether or not we should update
    based on the timestamp coming from the ODP
    """

    epoch = 0
    post_2038 = 111111111111111111111111111
    timestamp = test_check_for_update()

    assert not api.should_update(post_2038, timestamp)
    assert api.should_update(epoch, timestamp)
    return 11111111111


def test_ntp_last_updated():
    """
    Ensure that we are getting the correct last updated timestamp for
    Inclucivics if there is one.
    """

    timestamp = api.ntp_last_update()
    assert timestamp
    print timestamp
    print type(timestamp)
    assert isinstance(timestamp, int)
    assert int(timestamp)
    assert len(str(timestamp)) >= 10
    return int(timestamp)

#if __name__ == "__main__":
#    test_ntp_last_updated()
