// Getting elements using element id
let audioPlayer = document.getElementById("audioPlayer");
let fileInput = document.getElementById("fileInput");
let playlist = document.getElementById("playlist");
let playPauseBtn = document.getElementById("playPauseBtn");
let progressBar = document.querySelector(".progress-bar");
let progressContainer = document.querySelector(".progress-container");
let currentSongDisplay = document.getElementById("currentSong");

// Playlist song data
let songs = [
    { 
        name: "Love in Mexico - Carmen Maria", 
        url: "https://files.catbox.moe/ovb9fn.mp3", 
        image: "https://i.pinimg.com/736x/32/ce/77/32ce77dbf61d0d185a59ded675c8aef0.jpg"
    },
    { 
        name: "Could I Be Enough - Roads", 
        url: "https://files.catbox.moe/zdjkag.mp3", 
        image: "https://i.scdn.co/image/ab67616d00001e02b92eb46df986ab03fa7a748a"
    },
    { 
        name: "Denied Access - Density & Time", 
        url: "https://files.catbox.moe/x4qqn6.mp3", 
        image: "https://i.pinimg.com/736x/3d/50/7f/3d507f8e3336c2cc2d2f8731733402fb.jpg"
    }
];

let currentSongIndex = 0;
let isPlaying = false;

window.onload = updatePlaylist;

// function for uploading songs
function addSongs() {
    let files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        let songUrl = URL.createObjectURL(files[i]);

        // Assigning a default image for uploaded songs
        let defaultImage = "https://i.pinimg.com/736x/6c/e7/52/6ce7525ab572549475d23b378b7bdecc.jpg";

        songs.push({ name: files[i].name, url: songUrl, image: defaultImage });

        updatePlaylist();
    }
}

// Function for updating playlist
function updatePlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        let li = document.createElement("li");
        li.classList.add("playlist-item");

        let img = document.createElement("img");
        img.src = song.image;
        img.alt = song.name;
        img.classList.add("song-image");

        let songName = document.createElement("span");
        songName.textContent = song.name;
        songName.classList.add("song-name");
        songName.onclick = () => playSong(index);

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // Creating download button
        let downloadBtn = document.createElement("button");
        downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i>`;
        downloadBtn.classList.add("download-btn");
        downloadBtn.onclick = (event) => {
            event.stopPropagation();
            downloadSong(song);
        };

        // Creating delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            deleteSong(index);
        };

        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(deleteBtn);

        li.appendChild(img);
        li.appendChild(songName);
        li.appendChild(buttonContainer);
        playlist.appendChild(li);
    });
}

// Function for playing song
function playSong(index) {
    if (songs.length === 0) return;
    currentSongIndex = index;
    audioPlayer.src = songs[index].url;
    audioPlayer.play();
    isPlaying = true;
    updatePlayPauseButton();
    updateCurrentSongDisplay();
}

// Toggling between play and pause
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (songs.length === 0) return;
        audioPlayer.src = songs[currentSongIndex].url;
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

// Updating play/pause button
function updatePlayPauseButton() {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' 
        : '<i class="fa-solid fa-play"></i>';
}

// Function for displaying current song
function updateCurrentSongDisplay() {
    let song = songs[currentSongIndex];
    currentSongDisplay.innerHTML = `
        
        <h3>${song.name}</h3>
        <img src="${song.image}" alt="${song.name}" class="now-playing-image">
    `;
}

// function for playing next song
function nextSong() {
    if (songs.length > 0) {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }
}

// function for playing previous song
function prevSong() {
    if (songs.length > 0) {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }
}

// function for deleting song
function deleteSong(index) {
    let wasPlaying = isPlaying && currentSongIndex === index;
    
    songs.splice(index, 1);

    if (songs.length === 0) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayPauseButton();
        currentSongDisplay.textContent = "No song playing";
    } else if (wasPlaying) {
        currentSongIndex = index % songs.length;
        playSong(currentSongIndex);
    }

    updatePlaylist();
}

// // function for downloading song
function downloadSong(song) {
    fetch(song.url)
        .then(response => response.blob())
        .then(blob => {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = song.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error("Download failed:", error));
}

// Function for updating progress bar
audioPlayer.ontimeupdate = function () {
    let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + "%";
};

// function for seeking song
function seek(event) {
    let clickX = event.offsetX;
    let width = progressContainer.clientWidth;
    let newTime = (clickX / width) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
}

// Function for auto playing next song after current song ended
audioPlayer.onended = function () {
    nextSong();
};
