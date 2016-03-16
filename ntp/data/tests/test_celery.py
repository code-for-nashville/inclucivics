from ntp.data.tasks import test_task 
from random import randint
from copy import copy


def test_celery_task():
    """
    Run a time task to ensure that the celery worker is running and functions
    """

    val = randint(1, 1000)
    out = test_task.delay(copy(val))
    assert out > val
