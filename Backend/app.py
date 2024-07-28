from flask import Flask, request, jsonify, send_from_directory
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = tf.keras.models.load_model('cancer_classifier_model.h5')

def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(64, 64)) 
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) 
    img_array /= 255.0
    
    predictions = model.predict(img_array)
    return predictions

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
        
        predictions = model_predict(file_path, model)
        result = "Malignant" if predictions[0][0] > 0.5 else "Benign"
        
        return jsonify({'result': result})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('./uploads', filename)

if __name__ == '__main__':
    app.run(debug=True)
