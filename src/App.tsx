import React from 'react';
import './App.css';

import { Circle } from './components/test';
import { SimpleLineChart } from './components/SimpleLineChart';

function App() {
  return (
    <div className="App">
      <p>
        Working with d3
      </p>

      <p>Test1: Circle</p>
      <Circle />


      <p>Simple line chart</p>
      <SimpleLineChart />
    </div>
  );
}

export default App;
