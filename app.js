const statusEl = document.getElementById("status");
const titleEl = document.getElementById("stop-title");
const descEl = document.getElementById("stop-desc");
const videoEl = document.getElementById("video");
const debugEl = document.getElementById("debug");

const startBtn = document.getElementById("startBtn");
const demoBtn = document.getElementById("demoBtn");
const playBtn = document.getElementById("playBtn");

let stops = [];
let currentStop = null;

function log(msg){
  debugEl.textContent = msg;
  console.log(msg);
}

fetch("./stops.json")
  .then(r=>r.json())
  .then(data=>{
    stops = data;
    log("Stops loaded");
  });

function distance(a,b,c,d){
  const R=6371e3;
  const p1=a*Math.PI/180;
  const p2=c*Math.PI/180;
  const dp=(c-a)*Math.PI/180;
  const dl=(d-b)*Math.PI/180;
  const x=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function show(stop){
  titleEl.innerText = stop.title;
  descEl.innerText = stop.description;
  videoEl.src = stop.video;
  videoEl.load();

  videoEl.play().catch(()=>{
    playBtn.hidden=false;
  });
}

function check(lat,lon){
  stops.forEach(s=>{
    const d = distance(lat,lon,s.lat,s.lon);
    if(d < s.radius && currentStop !== s.id){
      currentStop = s.id;
      show(s);
      statusEl.innerText = "At: "+s.title;
    }
  });
}

startBtn.onclick = ()=>{
  navigator.geolocation.watchPosition(pos=>{
    check(pos.coords.latitude,pos.coords.longitude);
  }, err=>{
    statusEl.innerText = "GPS error";
  });
};

demoBtn.onclick = ()=>{
  const s = stops[0];
  check(s.lat, s.lon);
};

playBtn.onclick = ()=>{
  videoEl.play();
};