const stops = [
  {
    title: "Entrance",
    description: "Welcome to the Hill of Tara, the ancient seat of the High Kings of Ireland.",
    videoSrc: "assets/video/entrance.mp4"
  },
  {
    title: "St. Patrick",
    description: "This is where St. Patrick is said to have lit the Paschal fire.",
    videoSrc: "assets/video/st_patrick.mp4"
  },
  {
    title: "Banqueting Hall",
    description: "The long earthwork known as the Banqueting Hall stretches across the hill.",
    videoSrc: "assets/video/banqueting_hall.mp4"
  }
];

let currentStop = 0;

const titleEl = document.getElementById("sceneTitle");
const descEl = document.getElementById("sceneDescription");
const videoEl = document.getElementById("sceneVideo");

const startBtn = document.getElementById("startTour");
const prevBtn = document.getElementById("prevStopBtn");
const nextBtn = document.getElementById("nextStopBtn");

const loadingScreen = document.getElementById("loadingScreen");
const tourScreen = document.getElementById("tourScreen");

function loadStop(index) {
  const stop = stops[index];

  titleEl.textContent = stop.title;
  descEl.textContent = stop.description;

  videoEl.pause();
  videoEl.src = stop.videoSrc;
  videoEl.load();
}

// Start Tour
startBtn.addEventListener("click", () => {
  loadingScreen.classList.add("hidden");
  tourScreen.classList.remove("hidden");
  loadStop(currentStop);
});

// Previous Stop
prevBtn.addEventListener("click", () => {
  currentStop = (currentStop - 1 + stops.length) % stops.length;
  loadStop(currentStop);
});

// Next Stop
nextBtn.addEventListener("click", () => {
  currentStop = (currentStop + 1) % stops.length;
  loadStop(currentStop);
});
