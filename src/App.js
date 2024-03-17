import './App.css';
import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import Schedule from './components/Schedule';
import { parseStopTimesDataForRoute, parseStopsData } from './utils/gtfsParser';

function App() {
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);

  const [stopTimes, setStopTimes] = useState([]); 
  const [stopsData, setStopsData] = useState({});

  const [startTime, setStartTime] = useState('08:00:00'); 
  const [endTime, setEndTime] = useState('10:00:00');

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
      {Object.keys(stopsData).length && <Schedule data={stopsData} />}
    </div>
  );
}

export default App;
