
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const wrapper = $('.wrapper');
musicImg = wrapper.querySelector('.img-area img');
musicName = wrapper.querySelector('.song-details .name');
musicArtist = wrapper.querySelector('.song-details .artist');
mainAudio = wrapper.querySelector('#main-audio');
playPauseBtn = wrapper.querySelector('.play-pause');
prevBtn = wrapper.querySelector('#prev');
nextBtn = wrapper.querySelector('#next');
progressBar = wrapper.querySelector('.progress-section .progress-area .progress-bar');
progressArea = wrapper.querySelector('.progress-section .progress-area');
musicList = wrapper.querySelector('.music-list');
showMoreBtn = wrapper.querySelector('#more-music');
hideMusicBtn = musicList.querySelector('#close');

console.log(mainAudio);

showMoreBtn.addEventListener('click', ()=>{
    musicList.classList.toggle("show");
})

hideMusicBtn.addEventListener('click', ()=>{
    showMoreBtn.click();
})

let musicIndex = 1;

window.addEventListener("load",() => {
    loadMusic(musicIndex); 
    // calling loadMusic function once window loaded

    playIngNow();
})


// load Music fucntion
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name; 
    musicArtist.innerText  = allMusic[indexNumb - 1].artist;
    musicImg.src = `./images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `./songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play Music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector('i').innerText = "pause";
    mainAudio.play();
}

//pause Music function 
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector('i').innerText = "play_arrow";
    mainAudio.pause();
}

// next Music function
function nextMusic(){
    
    // increment of index by 1
    musicIndex++;

    //check 
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex;

    //call
    loadMusic(musicIndex);
    playMusic();
}

// previous Music function
function prevMusic(){
    
    // decrement of index by 1
    musicIndex--;

    //check 
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;

    //call
    loadMusic(musicIndex);
    playMusic();
}

// play or stop music button event
playPauseBtn.addEventListener('click', ()=>{
    const isMusicPaused = wrapper.classList.contains('paused');

    // if music paused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
})

// next music btn event
nextBtn.addEventListener('click', () => {
    nextMusic(); //calling next music function
    playIngNow();
})

// prev music btn event
prevBtn.addEventListener('click', () => {
    prevMusic(); //calling next music function
    playIngNow();
})

//update progress bar width according to music current time
mainAudio.addEventListener('timeupdate', (e)=>{
    // console.log(e);
    const currentTime = e.target.currentTime; // get current time
    const durationTime = e.target.duration; // get total time
    let progressWidth = (currentTime / durationTime) * 100;
    progressBar.style.width = progressWidth + '%';

    let musicCurrentTime = wrapper.querySelector('.current');
    let musicDurationTime = wrapper.querySelector('.duration');

    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);  
        if(totalSec < 10) { //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`
        }
        musicDurationTime.innerText = `${totalMin}:${totalSec}`;
    })

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);  
    if(currentSec < 10) { //adding 0 if sec is less than 10
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

//update playing song current time on according to the progressbar width
progressArea.addEventListener('click', (e)=>{
    let progressWidthval = progressArea.clientWidth; // get width of progress bar
    let clickedOffSetX = e.offsetX; // get offset x value
    let songDuration = mainAudio.duration; // get duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;

    // playMusic();
}) 

// repeat, shuffle song according to icon
const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', ()=> {
    let getText = repeatBtn.innerText;
    
    switch(getText){
        case 'repeat': 
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute('title','song looped');
            break;
        case 'repeat_one':
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute('title','Playback shuffle');
            break;
        case 'shuffle':
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute('title','Playlist looped');
            break;
    }
})

// repeat, shuffle song when click 
mainAudio.addEventListener('ended', ()=>{
    let getText = repeatBtn.innerText;

    switch(getText){
        case 'repeat': 
            nextMusic();
            break;
        case 'repeat_one':
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            break;
        case 'shuffle':
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
})

// Create li according to allMusic
const ulTag = wrapper.querySelector('ul');
let htmls = '';
for ( var i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="./songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`
    htmls += liTag;
}
ulTag.innerHTML = htmls;

// Fetch Duration of song in li tag
let spanAudio = ulTag.querySelectorAll('.audio-duration');
let audioTag = ulTag.querySelectorAll('audio');
for( var j = 0; j < audioTag.length; j++) {
    audioTag[j].addEventListener("loadeddata", (e)=>{
        // console.log(e);
        let audioDuration = e.target.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);  
        if(totalSec < 10) { //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`
        }
        e.target.nextElementSibling.innerHTML = `${totalMin}:${totalSec}`;
        // e.tartget.nextElementSibling.setAttribute('t-duration',`${totalMin}:${totalSec}`)
        console.log(e);
        e.target.nextElementSibling.setAttribute('t-duration',`${totalMin}:${totalSec}`);
    })
}

// playing paticular song on click
const allLiTags = ulTag.querySelectorAll('li');
function playIngNow() {
    for(var i = 0; i < allLiTags.length; i++) {

        let audioTag = allLiTags[i].querySelector('.audio-duration');
        // adding onclick attribute on li tags
        // dùng cách này sẽ gắn trực tiếp onclick vào li mà không bị lắng nghe cả thẻ tags con
        allLiTags[i].setAttribute("onclick", 'clicked(this)');
    
        //Không nên dùng cách này vì nó không chỉ lắng nghe của li mà còn lắng nghe cả các tags con của li
        // allLiTags[i].addEventListener('click',function(e){
        //     console.log(e);
        // });

        if(allLiTags[i].classList.contains('playing')){
            allLiTags[i].classList.remove('playing');

            //Một attribute mình tự set thì phải dùng get attribute để lấy giá tị của attribute tự set
            audioTag.innerText = audioTag.getAttribute('t-duration');
        }

        if(allLiTags[i].getAttribute('li-index') == musicIndex){
            allLiTags[i].classList.add('playing');
            audioTag.innerText = 'Playing';
        }
    }
}

// play song when click
function clicked(e) {
    // getting  li index of particular clicked li tag
    let getLiIndex = e.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playIngNow();
}