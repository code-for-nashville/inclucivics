import os
from flask import Flask

app = Flask(__name__)
app.debug = os.environ.get('NTP_DEBUG', '').lower() in ('1', 'true', 'yes',)

import views
import api
