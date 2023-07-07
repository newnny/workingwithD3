import './App.css';

import { SimpleLineChart } from './components/SimpleLineChart';

function App() {
  return (
    <div className="App">
      <p style={{fontSize: 30}}>
        Working with d3.js
      </p>

      <p style={{textAlign: "left", padding: 20}}>
        1. <b style={{fontSize: 20}}>Simple line chart</b> of Berlin highest temperature from 2020 to 2023 <br />
        Sorce: <a href="https://open-meteo.com/" target="_blank">open-meteo</a>
      </p>
      <SimpleLineChart />
    </div>
  );
}

export default App;
