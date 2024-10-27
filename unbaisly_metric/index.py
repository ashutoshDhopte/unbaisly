from flair.models import TARSClassifier
from flair.data import Sentence
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

classes = ["race bias","gender bias", "ethnicity bais", "sex bais", "religion bais", "income bais", 
           "gender stereotype","race stereotype","ethnicity stereotype","sex stereotype","religion stereotype","income stereotype",
           "social bias", "social stereotype", "economic bias", "economic stereotype", "occupation bias", "occupation stereotype",
           "age bias", "age stereotype", "disability bias", "disability stereotype", "socioeconomic bias", "socioeconomic stereotype",
           "LGBTQ bias", "LGBTQ stereotype", "weight bias", "weight stereotype", "class bias", "class stereotype"
        ]
tars = TARSClassifier.load('tars-base')

# Define a POST endpoint
@app.route('/api/baised-metric', methods=['POST'])
def receive_data() -> dict:
    # Get JSON data from the request
    data = request.json['data']

    lines = data.split(".")
    result = {}

    for line in lines:
        if line:
            sentence = Sentence(line)
            tars.predict_zero_shot(sentence, classes)
            for obj in sentence.get_labels():
                result[obj.value] = result.get(obj.value, 0) + obj.score

    for key, value in result.items():
        result[key] = str(round(value*100, 2)) + "%"
            

    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)