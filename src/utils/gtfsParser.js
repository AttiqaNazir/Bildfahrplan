export const parseStopsData = async () => {
  try {
    const tripResponse = await fetch('./TrainSchedule/trips.txt');
    const tripText = await tripResponse.text();

    const stopTimesResponse = await fetch('./TrainSchedule/stop_times.txt');
    const stopTimesText = await stopTimesResponse.text();

    const stopResponse = await fetch('./TrainSchedule/stops.txt');
    const stopsText = await stopResponse.text();

    const tripDataSplit = tripText.split('\n');
    const tripData = [];
    tripDataSplit.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) {
        const [route_id, , trip_id] = trimmed.split(',');

        if (!isNaN(parseInt(route_id, 10))) {
          tripData.push({
            routeId: route_id.trim(),
            tripId: trip_id.trim()
          });
        }
      }
    });

    const tripIds = tripData.slice(0, 2).map((data) => data.tripId);

    const tripsData = {};

    tripIds.forEach((tripId) => {
      tripsData[`trip_id_${tripId}`] = { stops: [] };
    });

    const stopTimesSplit = stopTimesText.split('\n');
    const stopsTimesData = [];
    stopTimesSplit.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) {
        const [trip_id, arrival_time, departure_time, stop_id] = trimmed.split(',');

        if (!isNaN(parseInt(trip_id, 10))) {
          stopsTimesData.push({
            tripId: trip_id.trim(),
            arrivalTime: arrival_time.trim(),
            departureTime: departure_time.trim(),
            stopId: stop_id.trim()
          });
        }
      }
    });

    const stopTimesDataFiltered = stopsTimesData.filter((data) => tripIds.includes(data.tripId));

    const stopsSplit = stopsText.split('\n');
    const stopsData = [];
    stopsSplit.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) {
        const [stop_id, stop_code, stop_name] = trimmed.split(',');

        if (stop_id !== 'stop_id') {
          stopsData.push({
            stopId: stop_id.trim(),
            stopCode: stop_code.trim(),
            stopName: stop_name.trim()
          });
        }
      }
    });

    const stops = [];
    stopTimesDataFiltered.forEach((stopTime) => {
      stopsData.forEach((stop) => {
        if (stop.stopId === stopTime.stopId) {
          stops.push({
            ...stopTime,
            ...stop
          });
        }
      });
    });

    const locations = new Set();

    stops.forEach((stop) => {
      locations.add(stop.stopName);
    });

    return {
      stops,
      locations: Array.from(locations)
    };
  } catch (error) {
    throw new Error(error.message ?? 'Something went wrong parsing the data');
  }
};
