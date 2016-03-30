from datetime import timedelta
import os
from celery.schedules import crontab

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_RESULT_BACKEND = "rpc://"

BROKER_IP = os.environ.get("RABBITMQ_PORT_5671_TCP_ADDR", "localhost")
BROKER_URL="amqp://guest@%s//" % BROKER_IP

CELERY_IMPORTS = ("ntp.data",)

CELERYBEAT_SCHEDULE = {
        'request-hr-data': {
            "task": "ntp.data.tasks.get_last_update",
            "schedule": crontab(0, 0, day_of_week="sat")
            }   
    }
