
console.log("Om namah shiwaya!!")
let CurrentSong = new Audio();
let songs;
let currfolder;
function convertToMinutesSeconds(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${mm}:${ss}`;
}

async function GetSongsList(folder) {
    currfolder = folder;
    const Playlist = await fetch(`http://127.0.0.1:3000/${folder}`)
    const Result = await Playlist.text()
    let div = document.createElement("div")
    div.innerHTML = Result;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let Lists = document.querySelector(".playlist-item").getElementsByTagName('ul')[0];
    Lists.innerHTML = "";
    for (const song of songs) {
        Lists.innerHTML = Lists.innerHTML + ` 
          <li id="side-playlist">
                        <img src="image stocks/musical-note.png" alt="">
                        <div class="song-info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Deepak</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img src="image stocks/play-button.png" alt="" style="filter: invert(0.5) !important;">
                        </div>
                    </li>`;
    }


    Array.from(document.querySelector(".playlist-item").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector(".song-info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim())
        })
    })
    return songs

}


const playMusic = (track, pause = false) => {
    CurrentSong.src = `/${currfolder}/` + track
    if (!pause) {
        CurrentSong.play()
        play.src = "pause.png"
    }
    document.querySelector(".songtitle").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {

    await GetSongsList("songs/All");
    playMusic(songs[0], true)

    play.addEventListener('click', () => {
        if (CurrentSong.paused) {
            CurrentSong.play()
            play.src = "pause.png"
        }
        else {
            CurrentSong.pause()
            play.src = "play.png"
        }
    })

    CurrentSong.addEventListener('timeupdate', () => {
        document.querySelector(".songtime").innerHTML = `${convertToMinutesSeconds(CurrentSong.currentTime)} / ${convertToMinutesSeconds(CurrentSong.duration)}`
        document.querySelector(".dot").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".dot").style.left = percent + "%"
        CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100
    })
    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".left-box").style.left = "0"
    })
    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector(".left-box").style.left = "-120%"
    })


    pre.addEventListener('click', () => {
        console.log("pre clicked")
        console.log(CurrentSong)
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })


    next.addEventListener('click', () => {
        CurrentSong.pause()
        console.log("next clicked")

        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100")
        CurrentSong.volume = parseInt(e.target.value) / 100;
    })

    const volumeslider = document.getElementById('volumeslider')
    let previousVolume = 1;
    volume.addEventListener('click', (e) => {
        if (volume.src.includes(".png")) {
            console.log("Muted");
            previousVolume = CurrentSong.volume;
            CurrentSong.volume = 0;
            volumeslider.value = 0;
            volume.src = "mute.svg";
        }
        else {
            CurrentSong.volume = previousVolume;
            volumeslider.value = previousVolume * 100;
            volume.src = "volume.png";
            CurrentSong.volume = 1;
        }
    })
    Array.from(document.getElementsByClassName("category")).forEach(e => {
        e.addEventListener('click', async item => {
            console.log(e)
            songs = await GetSongsList(`songs/${item.currentTarget.dataset.folder}`);

        })
    })
}
main();
