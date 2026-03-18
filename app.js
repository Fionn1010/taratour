let stops = [];
let currentStopIndex = -1;

fetch("./stops.json")
  .then(res => res.json())
  .then(data => {
    stops = data;
    startTracking();
  });

function startTracking() {
  if (!navigator.geolocation) {
    document.getElementById("status").innerText = "Geolocation not supported.";
    return;
  }

  navigator.geolocation.watchPosition(updatePosition, error, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
  });
}

function updatePosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  document.getElementById("status").innerText =
    `Your location: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;

  checkStops(lat, lon);
}

function checkStops(lat, lon) {
  stops.forEach((stop, index) => {
    const distance = getDistance(lat, lon, stop.lat, stop.lon);

    if (distance < stop.radius && index !== currentStopIndex) {
      currentStopIndex = index;
      showStop(stop);
    }
  });
}

function showStop(stop) {
  document.getElementById("stop-title").innerText = stop.title;
  document.getElementById("stop-desc").innerText = stop.description;

  const video = document.getElementById("video");
  video.src = stop.video;
  video.play();
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a =
    Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function error(err) {
  document.getElementById("status").innerText =
    `Error: ${err.message}`;
}