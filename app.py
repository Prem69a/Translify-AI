from flask import Flask, render_template, request, jsonify

from deep_translator import GoogleTranslator

from langdetect import detect

import webbrowser

from threading import Timer

import os


app = Flask(__name__)


# =====================================
# HISTORY
# =====================================

history = []

HISTORY_FILE = "history.txt"


def load_history():

    global history

    history = []

    if os.path.exists(HISTORY_FILE):

        with open(

            HISTORY_FILE,

            "r",

            encoding="utf-8"

        ) as file:

            for line in file:

                line = line.strip()

                if "||" in line:

                    parts = line.split(

                        "||",

                        1

                    )

                    history.append(

                        {

                            "input": parts[0].strip(),

                            "output": parts[1].strip()

                        }

                    )

        history.reverse()


def save_history():

    with open(

        HISTORY_FILE,

        "w",

        encoding="utf-8"

    ) as file:

        for item in reversed(history):

            file.write(

                f"{item['input']} || {item['output']}\n"

            )


load_history()


# =====================================
# AUTO OPEN BROWSER
# =====================================

def open_browser():

    webbrowser.open_new(

        "http://127.0.0.1:5000"

    )


# =====================================
# HOME
# =====================================

@app.route("/")

def home():

    return render_template(

        "index.html"

    )


# =====================================
# TRANSLATE
# =====================================

@app.route(

    "/translate",

    methods=["POST"]

)

def translate():

    data = request.get_json()

    text = data.get(

        "text",

        ""

    )

    source = data.get(

        "source",

        "auto"

    )

    target = data.get(

        "target",

        "en"

    )

    try:

        if source == "auto":

            source = detect(

                text

            )

        translated = GoogleTranslator(

            source=source,

            target=target

        ).translate(

            text

        )

        history.insert(

            0,

            {

                "input": text,

                "output": translated

            }

        )

        if len(

            history

        ) > 10:

            history.pop()

        save_history()

        return jsonify(

            {

                "success": True,

                "translated": translated

            }

        )

    except Exception as e:

        return jsonify(

            {

                "success": False,

                "translated": str(

                    e

                )

            }

        )


# =====================================
# HISTORY API
# =====================================

@app.route(

    "/history",

    methods=["GET"]

)

def get_history():

    return jsonify(

        history

    )
# =====================================
# CLEAR HISTORY
# =====================================

@app.route(

    "/clear_history",

    methods=["POST"]

)

def clear_history():

    global history

    history = []

    with open(

        HISTORY_FILE,

        "w",

        encoding="utf-8"

    ) as file:

        pass

    return jsonify(

        {

            "success": True

        }

    )

# =====================================
# START APP
# =====================================

if __name__ == "__main__":

    Timer(

        1,

        open_browser

    ).start()

    app.run(

        debug=True,

        use_reloader=False

    )