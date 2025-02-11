const audio = new Audio();
let currentTrackIndex = -1;
let tracks = [];

const playPauseButton = document.getElementById('play-pause');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const progressHandle = document.querySelector('.progress-handle');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeButton = document.getElementById('volume');
const volumeSlider = document.querySelector('.volume-slider');
const volumeTrack = document.querySelector('.volume-track');
const volumeHandle = document.querySelector('.volume-handle');

let isDragging = false;
let isVolumeDragging = false;
let volumeBeforeMute = 0.75;
audio.volume = volumeBeforeMute;

tracks = Array.from(document.querySelectorAll('.card-beat'))
    .filter(card => {
        const playButton = card.querySelector('.playpause');
        return playButton && playButton.dataset.src;
    })
    .map(card => ({
        element: card,
        src: card.querySelector('.playpause').dataset.src
    }));

function togglePlayPause() {
    if (currentTrackIndex === -1) return;
    if (audio.paused) {
        audio.play().catch(error => console.error('Play error:', error));
    } else {
        audio.pause();
    }
}

playPauseButton.addEventListener('click', togglePlayPause);

document.querySelectorAll('.card-beat').forEach((card, index) => {
    const playButton = card.querySelector('.playpause');
    playButton.addEventListener('click', () => {
        const src = playButton.dataset.src;
        if (!src) return;
        currentTrackIndex = tracks.findIndex(t => t.src === src);
        if (audio.src !== src) {
            audio.src = src;
            audio.load();
        }
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        updateActiveCard();
    });
});

function updateActiveCard() {
    document.querySelectorAll('.card-beat').forEach(card => {
        const playButton = card.querySelector('.playpause');
        card.classList.remove('active');
        playButton.textContent = '▶';
    });
    if (currentTrackIndex !== -1) {
        const activeCard = tracks[currentTrackIndex].element;
        activeCard.classList.add('active');
        activeCard.querySelector('.playpause').textContent = '⏸';
    }
}

document.querySelector('.skip-back').addEventListener('click', () => {
    if (tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(tracks[currentTrackIndex].src);
});

document.querySelector('.skip-forward').addEventListener('click', () => {
    if (tracks.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(tracks[currentTrackIndex].src);
});

function loadTrack(src) {
    if (currentTrackIndex !== -1) {
        const previousCard = tracks[currentTrackIndex].element;
        previousCard.querySelector('.playpause').textContent = '▶';
    }
    audio.src = src;
    audio.load();
    currentTrackIndex = tracks.findIndex(t => t.src === src);
    const wasPlaying = !audio.paused;
    audio.play().catch(error => {
        console.error('Playback error:', error);
        playPauseButton.textContent = 'play_arrow';
    }).finally(() => {
        if (wasPlaying) {
            playPauseButton.textContent = 'pause';
        }
    });
    updateActiveCard();
}

audio.addEventListener('play', () => {
    playPauseButton.textContent = 'pause';
    if (currentTrackIndex !== -1) {
        tracks[currentTrackIndex].element.querySelector('.playpause').textContent = '⏸';
    }
});

audio.addEventListener('pause', () => {
    playPauseButton.textContent = 'play_arrow';
    if (currentTrackIndex !== -1) {
        tracks[currentTrackIndex].element.querySelector('.playpause').textContent = '▶';
    }
});

audio.addEventListener('timeupdate', () => {
    if (!isDragging && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    currentTimeDisplay.textContent = '0:00';
});

let isProgressDragging = false;

progressBar.addEventListener('mousedown', (e) => {
    isProgressDragging = true;
    handleProgressDrag(e);
});

document.addEventListener('mousemove', (e) => {
    if (isProgressDragging) handleProgressDrag(e);
});

document.addEventListener('mouseup', () => {
    isProgressDragging = false;
});

function handleProgressDrag(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
}

volumeSlider.addEventListener('click', (e) => {
    const rect = volumeSlider.getBoundingClientRect();
    const volume = 1 - ((e.clientY - rect.top) / rect.height);
    audio.volume = Math.max(0, Math.min(1, volume));
    updateVolumeDisplay(audio.volume);
});

volumeButton.addEventListener('click', () => {
    updateVolumeDisplay(audio.muted ? 0 : audio.volume);
});

function updateVolumeDisplay(volume) {
    if (audio.muted) volume = 0;
    volumeHandle.style.bottom = `${volume * 100}%`;
    volumeTrack.style.background = `linear-gradient(to top, #1db954 ${volume * 100}%, #444 ${volume * 100}%)`;
    volumeButton.textContent = volume === 0 ? 'volume_off' :
        volume < 0.5 ? 'volume_down' : 'volume_up';
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

updateVolumeDisplay(audio.volume);


const menuToggle = document.getElementById("menu-toggle");
const closeMenu = document.getElementById("close-menu");
const navLinks = document.getElementById("navlinks");
const body = document.body

menuToggle.addEventListener("click", function() {
    navLinks.classList.add("show");
    body.style.overflow = 'hidden'
});

closeMenu.addEventListener("click", function() {
    navLinks.classList.remove("show");
    body.style.overflow = ''
});