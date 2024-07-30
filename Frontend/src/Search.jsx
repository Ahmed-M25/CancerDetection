import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/ask', { question });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setAnswer(response.data.answer);
    } catch (error) {
      setError('Error getting the answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Breast Cancer Q&A</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about breast cancer"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        {answer && <p style={styles.answer}>{answer}</p>}
      </header>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
  answer: {
    marginTop: '20px',
    fontSize: '18px',
  },
};

export default Search;
