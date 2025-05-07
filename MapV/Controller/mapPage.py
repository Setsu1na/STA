from flask import Blueprint
from flask import render_template, request
import json
from Dao.sqlDao import db
import hashlib

mapPage = Blueprint('mapPage', __name__)


@mapPage.route('/', methods=['GET', 'POST'])
def login():
    return render_template("map.html")
