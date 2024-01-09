const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
progressBar = container.querySelector(".progress-bar"),
VideTimeLine = container.querySelector(".video-timeline"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
playPauseBtn = container.querySelector(".play-pause i"),
skipForward = container.querySelector(".skip-forward i"),
sppedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
picInPicBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

/*container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});*/

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener("timeupdate", e => {
    let { currentTime, duration } = e.target;
    let precent = (currentTime / duration) * 100;
    progressBar.style.width = `${precent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", e => {
    videoDuration.innerText = formatTime(e.target.duration);
});

VideTimeLine.addEventListener("click", e => {
    let timelineWidth = VideTimeLine.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

const draggableProgressBar = e => {
    let timelineWidth = VideTimeLine.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

VideTimeLine.addEventListener("mousedown", () => {
    VideTimeLine.addEventListener("mousemove", draggableProgressBar);   
});

document.addEventListener("mouseup", () => {
    VideTimeLine.removeEventListener("mousemove", draggableProgressBar);   
});

VideTimeLine.addEventListener("mousemove", e => {
    const progressTime = VideTimeLine.querySelector("span");
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let timelineWidth = VideTimeLine.clientWidth;
    let precent = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(precent);
});

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 1;
        volumeSlider.value = 1;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0;
        volumeSlider.value = 0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0.0) {
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    } else {
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }
});

sppedBtn.addEventListener("click", () => {
    speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureinPicture(); //закончить, не работает!!!
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

skipBackward.addEventListener("click", () =>  {
    mainVideo.currentTime -=5;
});

skipForward.addEventListener("click", () =>  {
    mainVideo.currentTime +=5;
});

playPauseBtn.addEventListener("click", () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
    playPauseBtn.classList.replace("fa-play", "fa-pause")
});

mainVideo.addEventListener("pause", () => {
    playPauseBtn.classList.replace("fa-pause", "fa-play")
});


document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        mainVideo.paused ? mainVideo.play() : mainVideo.pause();
    }
});

mainVideo.addEventListener("click", () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' ) {
        mainVideo.currentTime +=5;
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' ) {
        mainVideo.currentTime -=5;
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' ) {
        (mainVideo.volume +=0.1);
        volumeSlider.value = mainVideo.volume;
        if(!volumeBtn.classList.contains("fa-volume-high")) {
            mainVideo.volume = 0.1;
            volumeSlider.value = 0.1;
            volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }
}
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown' ) {
        (mainVideo.volume -=0.1);
        volumeSlider.value = mainVideo.volume;
        if(!volumeBtn.classList.contains("fa-volume-high")) {
            mainVideo.volume = 0;
            volumeSlider.value = 0;
            volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
    }
});

document.addEventListener('keydown', function(event) {
    if ((event.key === 'f') || (event.key === 'а')) {
        if(!document.fullscreenElement) {
        container.classList.toggle("fullscreen");
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        container.requestFullscreen();
        } else {

        }
    }
});

document.addEventListener('keydown', function(event) {
    if ((event.key === 'c') || (event.key === 'с')) {
        if(document.fullscreenElement) {
        container.classList.toggle("fullscreen");
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
        
        } else {
            
        }

    }
});


