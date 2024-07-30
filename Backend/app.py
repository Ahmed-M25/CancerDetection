from flask import Flask, request, jsonify, send_from_directory
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from flask_cors import CORS
import google.generativeai as genai
import traceback

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

API_KEY = 'AIzaSyCbN9ll8g3VBnYmqJ0rscdJbMageNamWCQ'
genai.configure(api_key=API_KEY)

gemeniModel = genai.GenerativeModel('gemini-1.5-flash')

model = tf.keras.models.load_model('cancer_classifier_model.h5')

def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(64, 64)) 
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) 
    img_array /= 255.0
    
    predictions = model.predict(img_array)
    return predictions

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400

    try:
        response = gemeniModel.generate_content(question)
        print(response)
        
        response_data = response._result if hasattr(response, '_result') else response
        candidates = response_data.candidates if hasattr(response_data, 'candidates') else []
        if candidates:
            answer = candidates[0].content.parts[0].text
        else:
            answer = 'No answer found'
        
        return jsonify({'answer': answer})
    except Exception as e:
        error_message = f'Error occurred: {str(e)}'
        print(error_message)
        print(traceback.format_exc())
        return jsonify({'error': error_message}), 500


@app.route('/predict', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        file_path = os.path.join('./uploads', file.filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)
        
        try:
            predictions = model_predict(file_path, model)
            result = "Malignant" if predictions[0][0] > 0.5 else "Benign"
            return jsonify({'result': result})
        except Exception as e:
            error_message = f'Error occurred: {str(e)}'
            print(error_message)
            return jsonify({'error': error_message}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('./uploads', filename)

if __name__ == '__main__':
    app.run(debug=True)
