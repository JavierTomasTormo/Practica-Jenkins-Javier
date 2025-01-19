import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Jenkins Demo</h1>
        <div className="counter-section">
          <h2>Counter: {count}</h2>
          <button onClick={handleIncrement}>Increment</button>
        </div>
        <div className="message-section">
          <input 
            type="text" 
            value={message} 
            onChange={handleMessageChange}
            placeholder="Enter a message"
          />
          <p>Your message: {message}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
