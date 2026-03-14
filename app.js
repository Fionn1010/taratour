const stops = [
  {
    id: "entrance",
    title: "The Entrance",
    description:
      "Welcome to the Hill of Tara. This is the starting point of the tour, where visitors begin their walk into one of Ireland's most important ancient ceremonial landscapes.",
    lat: 53.5809,
    lng: -6.6116,
    triggerRadius: 60,
    videoSrc: "",
    narration:
      "Welcome to the Hill of Tara. You are standing at the entrance to one of the most important royal and ceremonial sites in Ireland. As you walk through the landscape, imagine generations of people gathering here for ritual, power, memory, and story."
  },
  {
    id: "patrick",
    title: "St. Patrick and the Church",
    description:
      "This point introduces the Christian layer of Tara, where the story of St. Patrick intersects with older royal power and sacred tradition.",
    lat: 53.5812,
    lng: -6.6111,
    triggerRadius: 55,
    videoSrc: "",
    narration:
      "Tradition connects Tara with Saint Patrick, whose arrival symbolised a major turning point in Irish history. Here the older world of kingship and ceremony met the new Christian faith, adding another layer to the story of Tara."
  },
  {
    id: "banqueting-hall",
    title: "The Banqueting Hall",
    description:
      "The long earthwork known as the Banqueting Hall stretches dramatically across the slope. It may have been ceremonial rather than a literal hall, but it still powerfully frames the approach to Tara.",
    lat: 53.5821,
    lng: -6.611,
    triggerRadius: 65,
    videoSrc: "",
    narration:
      "Ahead of you is the Banqueting Hall, a remarkable linear earthwork. Although the name suggests feasting, archaeologists debate its exact purpose. Whatever its use, it creates a grand processional line through the landscape."
  },
  {
    id: "synods",
    title: "Rath of the Synods and the Palisade",
    description:
      "This area was once a focal point of royal activity. It is associated with monumental enclosure and, in your tour concept, the reconstructed timber palisade.",
    lat: 53.5825,
    lng: -6.6104,
    triggerRadius: 55,
    videoSrc: "",
    narration:
      "You are now near the Rath of the Synods, one of Tara's major enclosures. This is the perfect place in the digital tour to visualise timber structures, boundaries, and the sense of ceremony that once shaped movement through the site."
  },
  {
    id: "hostages",
    title: "The Mound of the Hostages",
    description:
      "This Neolithic passage tomb is far older than the medieval legends of Tara. It reminds us that the hill was sacred long before the age of kings.",
    lat: 53.5828,
    lng: -6.6109,
    triggerRadius: 45,
    videoSrc: "",
    narration:
      "This is the Mound of the Hostages, a prehistoric passage tomb dating back thousands of years. Its presence shows that Tara was already a place of ritual and significance long before it became associated with high kingship."
  },
  {
    id: "teach-cormaic",
    title: "Teach Cormaic",
    description:
      "Teach Cormaic, pronounced Chock Cormuck, is linked in tradition with Cormac mac Airt. In your concept version, this is where the royal house can be reimagined in timber and thatch.",
    lat: 53.5823,
    lng: -6.6112,
    triggerRadius: 50,
    videoSrc: "",
    narration:
      "This point is associated with Teach Cormaic, linked in legend with the great king Cormac mac Airt. In the digital reconstruction, this is where a royal timber structure can help visitors imagine Tara as a living ceremonial centre."
  },
  {
    id: "stone-of-destiny",
    title: "The Stone of Destiny",
    description:
      "The Lia Fáil, or Stone of Destiny, is one of the best known monuments at Tara. Tradition says it cried out under the rightful king.",
    lat: 53.5825,
    lng: -6.6114,
    triggerRadius: 45,
    videoSrc: "",
    narration:
      "Before you stands the Stone of Destiny, the Lia Fáil. In later tradition it was the coronation stone of the kings of Tara and was said to cry out when touched by the rightful ruler."
  }
];

const els = {
  loadingScreen: document.getElementById("loadingScreen"),
  startTour: document.getElementById("startTour"),
  gpsStatus: document.getElementById("gpsStatus"),
  locationDot: document.getElementById("locationDot"),
  sceneTitle: document.getElementById("sceneTitle"),
  sceneDescription: document.getElementById("sceneDescription"),
  nearestStop: document.getElementById("nearestStop"),
  distanceAway: document.getElementById("distanceAway"),
  prevStopBtn: document.getElementById("prevStopBtn"),
  nextStopBtn: document.getElementById("nextStopBtn"),
  playNarrationBtn: document.getElementById("playNarrationBtn"),
  stopTourBtn: document.getElementById("stopTourBtn"),
  recenterBtn: document.getElementById("recenterBtn"),
  sceneVideo: document.getElementById("sceneVideo")
};

let activeStopIndex = 0;
let watchId = null;
let lastPosition = null;
let speechUtterance = null;

function updateScene(stop) {
  els.sceneTitle.textContent = stop.title;
  els.sceneDescription.textContent = stop.description;
  els.nearestStop.textContent = `Nearest stop: ${stop.title}`;

  if (lastPosition) {
    const metres = distanceInMeters(
      lastPosition.coords.latitude,
      lastPosition.coords.longitude,
      stop.lat,
      stop.lng
    );
    els.distanceAway.textContent = `Distance: ${Math.round(metres)}m`;
  } else {
    els.distanceAway.textContent = "Distance: —";
  }

  if (stop.videoSrc) {
    if (els.sceneVideo.src !== stop.videoSrc) {
      els.sceneVideo.src = stop.videoSrc;
      els.sceneVideo.play().catch(() => {});
    }
  } else {
    els.sceneVideo.removeAttribute("src");
    els.sceneVideo.load();
  }
}

function goToStop(index) {
  activeStopIndex = (index + stops.length) % stops.length;
  updateScene(stops[activeStopIndex]);
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Speech narration is not supported on this device.");
    return;
  }

  window.speechSynthesis.cancel();
  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.rate = 0.95;
  speechUtterance.pitch = 1.0;
  speechUtterance.lang = "en-IE";
  window.speechSynthesis.speak(speechUtterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function setGpsState(state, message) {
  els.gpsStatus.textContent = message;

  els.locationDot.classList.remove("active", "searching");

  if (state === "active") {
    els.locationDot.classList.add("active");
  } else if (state === "searching") {
    els.locationDot.classList.add("searching");
  }
}

function distanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestStop(latitude, longitude) {
  let nearest = stops[0];
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  stops.forEach((stop, index) => {
    const d = distanceInMeters(latitude, longitude, stop.lat, stop.lng);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearest = stop;
      nearestIndex = index;
    }
  });

  return { nearest, nearestIndex, nearestDistance };
}

function handlePosition(position) {
  lastPosition = position;

  const { latitude, longitude, accuracy } = position.coords;
  const { nearest, nearestIndex, nearestDistance } = findNearestStop(latitude, longitude);

  goToStop(nearestIndex);
  els.distanceAway.textContent = `Distance: ${Math.round(nearestDistance)}m`;
  setGpsState(
    "active",
    `GPS active • accuracy ${Math.round(accuracy)}m • near ${nearest.title}`
  );

  if (nearestDistance <= nearest.triggerRadius) {
    els.sceneDescription.textContent =
      `${nearest.description} You are now within the trigger zone for this stop.`;
  }
}

function handleLocationError(error) {
  console.error(error);

  let message = "Could not access GPS. Using manual stop navigation.";

  if (error.code === 1) {
    message = "Location permission denied. You can still browse the tour manually.";
  } else if (error.code === 2) {
    message = "Location unavailable right now. Try moving outdoors or checking signal.";
  } else if (error.code === 3) {
    message = "GPS request timed out. You can still browse the tour manually.";
  }

  setGpsState("idle", message);
}

function startGpsWatch() {
  if (!("geolocation" in navigator)) {
    setGpsState("idle", "This browser does not support geolocation.");
    return;
  }

  setGpsState("searching", "Starting GPS…");

  watchId = navigator.geolocation.watchPosition(handlePosition, handleLocationError, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 5000
  });
}

function checkLocationOnce() {
  if (!("geolocation" in navigator)) {
    setGpsState("idle", "This browser does not support geolocation.");
    return;
  }

  setGpsState("searching", "Checking current location…");

  navigator.geolocation.getCurrentPosition(handlePosition, handleLocationError, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  });
}

els.startTour.addEventListener("click", async () => {
  els.loadingScreen.classList.add("hidden");
  goToStop(0);
  startGpsWatch();

  try {
    await els.sceneVideo.play();
  } catch (err) {
    // Safe to ignore on browsers that block autoplay without a source.
  }
});

els.prevStopBtn.addEventListener("click", () => goToStop(activeStopIndex - 1));
els.nextStopBtn.addEventListener("click", () => goToStop(activeStopIndex + 1));
els.playNarrationBtn.addEventListener("click", () => speak(stops[activeStopIndex].narration));
els.stopTourBtn.addEventListener("click", stopSpeaking);
els.recenterBtn.addEventListener("click", checkLocationOnce);

updateScene(stops[0]);
