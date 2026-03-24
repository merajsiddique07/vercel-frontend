import React, { useState } from "react";

function QuickHelp() {
  const [showPopup, setShowPopup] = useState(false);
  const [stations, setStations] = useState([]);

  const handleQuickHelp = () => {
    setShowPopup(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Overpass API query
      const query = `
        [out:json];
        node["amenity"="police"](around:2000,${lat},${lng});
        out;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();

      const stationsWithDistance = data.elements.map((place) => {
        const dist = getDistance(lat, lng, place.lat, place.lon);

        return {
          id: place.id,
          name: place.tags.name || "Police Station",
          distance: dist.toFixed(1),
          lat: place.lat,
          lng: place.lon,
        };
      });

      setStations(stationsWithDistance);
    });
  };

  // Distance formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`);
  };

  return (
    <div>
      <button onClick={handleQuickHelp}>⚡ Quick Help</button>

      {showPopup && (
        <div className="popup">
          <h2>🚓 Nearby Police Stations</h2>

          {stations.length === 0 ? (
            <p>Loading...</p>
          ) : (
            stations.slice(0, 5).map((station) => (
              <div key={station.id} className="card">
                <h3>🚓 {station.name}</h3>
                <p>📍 {station.distance} km away</p>
                <p>⭐ N/A</p>

                <button onClick={() => openMap(station.lat, station.lng)}>
                  🧭 Navigate
                </button>
              </div>
            ))
          )}

          <button onClick={() => setShowPopup(false)}>❌ Close</button>
        </div>
      )}
    </div>
  );
}

export default QuickHelp;
