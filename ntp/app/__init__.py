from flask import Flask

app = Flask(__name__)
app.debug = True

from views import index
from api import departments, data