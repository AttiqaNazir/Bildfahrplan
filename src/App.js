import './App.css';
import React, { useState, useEffect } from 'react';
import Schedule from './components/Schedule';
import { parseStopsData } from './utils/gtfsParser';

function App() {
  const [stopsData, setStopsData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stopsDataResponse = await parseStopsData();
        setStopsData(stopsDataResponse);
      } catch (error) {
        console.error('Error fetching or parsing GTFS data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <header className="App-header">BILDFAHRPLAN</header>

      {Object.keys(stopsData).length && <Schedule data={stopsData} />}
    </div>
  );
}

export default App;
