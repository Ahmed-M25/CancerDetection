import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPrediction(response.data.result);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setPrediction('Error uploading the file.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Breast Cancer Classifier</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload and Predict</button>
        </form>
        {prediction && <p>Prediction: {prediction}</p>}
      </header>
    </div>
  );
}

export default App;
