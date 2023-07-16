import './App.css';

import { SimpleLineChart } from './components/SimpleLineChart';
import { ScatterChart } from './components/ScatterChart';

function App() {
  return (
    <div className="App">
      <p style={{ fontSize: 30 }}>
        Working with d3.js
      </p>

      <p style={{ textAlign: "left", padding: 20 }}>
        1. <b style={{ fontSize: 20 }}>Simple line chart</b> of Berlin highest temperature from 2020 to 2023 <br />
        Sorce: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">open-meteo</a>
      </p>
      <SimpleLineChart />

      <p style={{ textAlign: "left", padding: 20 }}>
        2. <b style={{ fontSize: 20 }}>Simple scatter chart</b> of Bob ross painting <br />
        Sorce: <a href="https://github.com/jwilber/Bob_Ross_Paintings" target="_blank" rel="noreferrer">Github Bob ross painting</a>
      </p>
      <ScatterChart />
    </div>
  );
}

export default App;
