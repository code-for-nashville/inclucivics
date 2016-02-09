from datetime import timedelta
from celery.schedules import crontab

BROKER_URL="amqp://guest@localhost//"
CELERY_IMPORTS = ("ntp.data",)
CELERYBEAT_SCHEDULE = {
        'request-hr-data': {
            "task": "ntp.data.tasks.get_last_update",
            "schedule": crontab(0, 0, day_of_week="sat")
            }   
    }
