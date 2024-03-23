let currentsong = new Audio()
let playlist_songs = []
async function getsong() {
    let playlist = await fetch("http://127.0.0.1:3000/songs/")
    let response = await playlist.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let a = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < a.length; i++) {
        const element = a[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
function playmusic(aud) {
    currentsong.src = "/songs/" + aud
    currentsong.play()
    play.src = "pause.svg"
    //to change the song_name in seek bar
    document.querySelector(".song_update").innerHTML = decodeURI(aud)
}

function sec_to_min(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function main() {
    playlist_songs = await getsong()
    let songul = document.querySelector(".songs_list")
    for (let son of playlist_songs) {
        songul.innerHTML = songul.innerHTML + `<li><img src="song.svg" >
        <div><span>${son.replaceAll("%20", " ")}</span>
        <span>hardik</span></div>
        <div>play now</div>
        <img src="play.svg" class="play_plyst">
    </li>`
    }

    //it wil choose the song from playlist and play
    Array.from(document.querySelector(".songs_list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(e.getElementsByTagName("div")[0].firstElementChild.innerHTML)

        })
    });

    //to play next and previous song
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        } else {
            currentsong.pause()
            play.src = "play.svg"
        }

    })

    //time update on seek bar
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".time_update").innerHTML =
            `${sec_to_min(currentsong.currentTime)}/${sec_to_min(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

    })
    const seekbar = document.querySelector(".seekbar")

    seekbar.addEventListener("click", ((e) => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        //taget.getboundaningClientRect() - > this function gets us the x and y and boundary or seek bar
        currentsong.currentTime = (currentsong.duration) * percent / 100

    }))
    document.querySelector(".hamburger").addEventListener("click", (() =>{
        document.querySelector("aside").style.left = "0" 
    }))
    document.querySelector(".cross").addEventListener("click", (() =>{
        document.querySelector("aside").style.left = "-100%" 
    }))

    //previous button event
    previous.addEventListener("click",()=>{
        let index = playlist_songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>0){
            playmusic(playlist_songs[index-1])
        }
    
        
    })

    //for next
    next.addEventListener("click",()=>{
        let index = playlist_songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)>length){
            playmusic(playlist_songs[index+1])
        }
    
        
    })


}

main()
