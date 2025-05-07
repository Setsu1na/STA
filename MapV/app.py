from flask import Flask
from flask import render_template
from Controller.mapPage import mapPage
from Controller.videoPage import videoPage

app = Flask(__name__)





app.register_blueprint(mapPage)
app.register_blueprint(videoPage)


if __name__ == '__main__':
    app.run()

