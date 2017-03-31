var debug = document.getElementById("debug");
config = {
    songs: 4,
    slides: 9,
    shuffle: true,
    idle : 5000
};

var songsAmount=0;
var slidesAmount=0;
var trackNumber = 0;
var player = new Audio();
var shuffle = false;
var slidesContainer = document.getElementById("slidesContainer");
var slidesEvent = new Event('built-slides');
var arrangeEvent = new Event('arranged-slides');
var detectedVideos = [];
var jssor_1_slider;


songsAmount = config.songs;
slidesAmount = config.slides;
shuffle = (config.shuffle == 'true');

buildSlides();

document.addEventListener('built-slides',arrangeSlides,false);

document.addEventListener('arranged-slides',main,false);

function jssor_1_slider_init() {

    var jssor_1_SlideshowTransitions = [
        {$Duration:2500,$Opacity:2,$Brother:{$Duration:4000,$Opacity:2}}
    ];
    var jssor_1_options = {
        $AutoPlay: true,
        $Idle: config.idle,
        $FillMode: 1,
        $SlideshowOptions: {
            $Class: $JssorSlideshowRunner$,
            $Transitions: jssor_1_SlideshowTransitions,
            $TransitionsOrder: 1
        }
    };

    jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
};


function main() {
    jssor_1_slider_init();
    player.addEventListener("ended", nextSong, false);
    playTrack(0);
    updateDimensions();
    addResumeListeners();
    jssor_1_slider.$On($JssorSlider$.$EVT_SLIDESHOW_START,function(slideIndex, progress,progressStart,idleStart,idleEnd,progressEnd){
        if (detectedVideos.indexOf(slideIndex+1) >= 0){
            // fadeOut(4000);
        }
        else if (player.paused) {
            // fadeIn(3000);
        }
    });
    jssor_1_slider.$On($JssorSlider$.$EVT_SLIDESHOW_END,function(slideIndex, progress,progressStart,idleStart,idleEnd,progressEnd){
        if (detectedVideos.indexOf(slideIndex+1) >= 0){
            jssor_1_slider.$Pause();
            document.getElementById(slideIndex+1).firstChild.currentTime = 0;
            document.getElementById(slideIndex+1).firstChild.play();
        }
    });
};


function buildSlides() {

    for( var i = 1; i <= slidesAmount ; i++){

        var div = document.createElement("div");
        div.id = i;

        var img = document.createElement("img");
        img.src = "img/" + i + ".jpg";
        img.alt = img.src + " not found.";
        img.setAttribute("data-u","image");
        

        var video = document.createElement("video");
        video.src= "img/" + i + ".mp4";
        
        
        img.addEventListener('load', (function(div,img){
            div.appendChild(img);
            slidesContainer.appendChild(div);
            if(slidesContainer.childElementCount-1 == slidesAmount)
                 document.dispatchEvent(slidesEvent);
        }).bind(null,div,img),false);
        
        img.addEventListener('error', function(div,video){
            detectedVideos.push(parseInt(div.id));
            div.appendChild(video);
            slidesContainer.appendChild(div);
            if(slidesContainer.childElementCount-1 == slidesAmount)
                document.dispatchEvent(slidesEvent);
        }.bind(null,div,video));
    }
}

function arrangeSlides() {
    var temp;
    for (var i = 1 ; i <= slidesAmount ; i++) {
        temp = slidesContainer.removeChild(document.getElementById(i));
        slidesContainer.appendChild(temp);
    }
    document.dispatchEvent(arrangeEvent);
}

function addResumeListeners(){
    detectedVideos.forEach(function(i){
        document.getElementById(i).firstChild.addEventListener('ended',function(){
            jssor_1_slider.$Play();
        });
        
    });
}

function updateDimensions() {
    document.querySelectorAll("video").forEach(function(video){
        var testRatio = video.videoWidth / video.videoHeight - jssor_1_slider.$OriginalWidth() / jssor_1_slider.$OriginalHeight();
        if (testRatio > 0){
            video.width = jssor_1_slider.$OriginalWidth();
        }
        else if (testRatio < 0) {
            video.videoHeight = jssor_1_slider.$OriginalHeight();
        }
        else {
            video.width = jssor_1_slider.$OriginalWidth();
            video.height = jssor_1_slider.$OriginalHeight();
        }
    });
}

function prevSong(){
    trackNumber = shuffle ? getRNG() : (songsAmount + (--trackNumber)) % songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
    return trackNumber;
}
function nextSong(){
    trackNumber = shuffle ? getRNG() : ++trackNumber%songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
    return trackNumber;
    ;
}

function loadTrack(i) { //load only no play
    var src = /*"https://s3-sa-east-1.amazonaws.com/wixtestbucket/music/" +*/ "music/" + i + ".mp3";
    player.src = src;
    player.load();
}

function playTrack(i){ //load and play
    loadTrack(i);
    player.play();
}

// function fadeOut(milliseconds = 0){
//     var steps = 10;
//     var stepDuration = milliseconds / steps;

//     reduceVolume();
//     function reduceVolume(){
//         if( player.volume == 0 ){
//             player.pause();  //WAS player.pause() NOW player.pause();  -_-
//         }
//         else
//         {
//             var dec = parseInt(player.volume.toFixed(2).replace(/\d./i,"")) - 10;
//             if(player.volume == 1){
//                 dec = 90;
//             }
//             player.volume = "0." + dec;
//             setTimeout(reduceVolume, stepDuration);
//         }
//     }
// }

// function fadeIn(milliseconds = 0){
//     var steps = 10;
//     var stepDuration = milliseconds / steps;

//     raiseVolume();
//     function raiseVolume(){
//         if ( player.volume != 1 )
//         {
//             if(player.volume == 0){
//                 player.play();
//             }
//             var dec = parseInt(player.volume.toFixed(2).replace(/\d./i,"")) + 10;
//             if (dec==100)
//                 player.volume = 1;
//             else 
//                 player.volume = "0." + dec;

//             setTimeout(raiseVolume,stepDuration);
//         }
//     }
// }



function toggleShuffle(){
    shuffle = !shuffle;
    return shuffle;
}

function getRNG(){
    var num = trackNumber;
    while (num == trackNumber && songsAmount>1){
        num = Math.floor(Math.random()*songsAmount);
    }
    return num;
}

function consoleLog(input){
    debug.innerHTML += input + "<br>";
}