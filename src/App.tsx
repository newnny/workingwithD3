import './App.css';

import { SimpleLineChart } from './components/SimpleLineChart';
import { ScatterChart } from './components/ScatterChart';
import { ScatterBobRoss } from './components/ScatterBobRoss';
import { SimpleBarChar } from './components/SimpleBarChart';
function App() {
  return (
    <div className="App">
      <p style={{ fontSize: 30 }}>
        Working with d3.js
      </p>

      <p style={{ textAlign: "left", padding: 20 }}>
        1. <b style={{ fontSize: 20 }}>Simple line chart</b> <br />
        Berlin highest temperature from 2020 to 2023 <br />
        Sorce: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">open-meteo</a>
      </p>
      <SimpleLineChart />
      
      <p style={{ textAlign: "left", padding: 20 }}>
        2. <b style={{ fontSize: 20 }}>Simple Bar chart</b> <br />
        Dog Ownership by Country 2023 <br />
        Sorce: <a href="https://WorldPopulationReview.com" target="_blank" rel="noreferrer">Dog Ownership by Country 2023 </a>
      </p>
      <SimpleBarChar />

      <p style={{ textAlign: "left", padding: 20 }}>
        3. <b style={{ fontSize: 20 }}>Scatter chart</b> <br />
        compare the total number of colors Bob Ross used in his paintings to the number of unique colors.<br />
        Sorce: <a href="https://github.com/jwilber/Bob_Ross_Paintings" target="_blank" rel="noreferrer">Github Bob ross painting</a>
      </p>
      <ScatterBobRoss />
      
      <p style={{ textAlign: "left", padding: 20 }}>
        4. <b style={{ fontSize: 20 }}>Simple scatter chart</b> <br />
        US weather data<br />
        Sorce: Fullstack D3 Masterclass
      </p>
      <ScatterChart />
    </div>
  );
}

export default App;
