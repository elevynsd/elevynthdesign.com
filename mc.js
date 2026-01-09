// -------- Playlist (your “carousel”) --------
// Update these paths to your real files.
const playlist = [
  {
    title: "encounter",
    artist: "evelyn stephen",
    src: "audio/encounter.mp3",
    vinylImage: "images/mc/1.svg",
  },
  {
    title: "missing",
    artist: "evelyn stephen",
    src: "audio/missing.mp3",
    vinylImage: "images/mc/2.svg",
  },
  {
    title: "an ode to new drivers",
    artist: "evelyn stephen",
    src: "audio/aotnd.mp3",
    vinylImage: "images/mc/3.svg",
  },
  {
    title: "altostratus",
    artist: "evelyn stephen",
    src: "audio/altostratus.mp3",
    vinylImage: "images/mc/4.svg",
  },
  {
    title: "resolution",
    artist: "evelyn stephen",
    src: "audio/resolution.mp3",
    vinylImage: "images/mc/5.svg",
  },
  {
    title: "cafe terrace at night",
    artist: "evelyn stephen",
    src: "audio/ctan.mp3",
    vinylImage: "images/mc/6.svg",
  }
];

// -------- Grab elements --------
const audio = document.getElementById("audio");

const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");


const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const back10Btn = document.getElementById("back10Btn");
const fwd10Btn = document.getElementById("fwd10Btn");

const seek = document.getElementById("seek");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");



const vinyl = document.getElementById("vinyl");

// -------- State --------
let index = 0;
let isSeeking = false;



// -------- Helpers --------
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function setPlayIcon(isPlaying) {
  // Play triangle vs Pause bars
  playIcon.innerHTML = isPlaying
    ? `<path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"></path>`
    : `<path d="M8 5v14l11-7L8 5z"></path>`;
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function loadTrack(newIndex, autoplay = false) {
  index = (newIndex + playlist.length) % playlist.length;
  const track = playlist[index];

  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
 vinyl.src = track.vinylImage || "images/music/vinyl.png";


  audio.src = track.src;
  audio.load();

 

  // Like UI
  likeBtn.classList.toggle("is-liked", liked[index]);
  likeBtn.setAttribute("aria-pressed", liked[index] ? "true" : "false");

  // Reset progress UI
  seek.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  setPlayIcon(false);

  if (autoplay) audio.play().catch(() => {});
}

// -------- Wire up events --------
playBtn.addEventListener("click", () => {

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => setPlayIcon(true));
audio.addEventListener("pause", () => setPlayIcon(false));

audio.addEventListener("play", () => {
  vinyl.classList.add("is-spinning");
});

audio.addEventListener("pause", () => {
  vinyl.classList.remove("is-spinning");
});

audio.addEventListener("ended", () => {
  vinyl.classList.remove("is-spinning");
});


prevBtn.addEventListener("click", () => loadTrack(index - 1, true));
nextBtn.addEventListener("click", () => loadTrack(index + 1, true));

back10Btn.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

fwd10Btn.addEventListener("click", () => {
  audio.currentTime = Math.min(audio.duration || audio.currentTime + 10, audio.currentTime + 10);
});

// Seek bar interaction
seek.addEventListener("input", () => {
  isSeeking = true;
  const pct = Number(seek.value) / 100;
  const t = (audio.duration || 0) * pct;
  currentTimeEl.textContent = formatTime(t);
});

seek.addEventListener("change", () => {
  const pct = Number(seek.value) / 100;
  audio.currentTime = (audio.duration || 0) * pct;
  isSeeking = false;
});

// Update progress as the track plays
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  durationEl.textContent = formatTime(audio.duration);

  if (!isSeeking) {
    const pct = (audio.currentTime / audio.duration) * 100;
    seek.value = String(pct);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Auto-next at end
audio.addEventListener("ended", () => loadTrack(index + 1, true));



// -------- Start (robust init) --------
function initPlayer() {
  loadTrack(0, false); // sets audio.src immediately
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPlayer);
} else {
  // DOM is already ready (common in some preview tools)
  initPlayer();
}

