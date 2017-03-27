
var songsAmount=0;
var imagesAmount=0;
var trackNumber = 0;
var source = document.getElementById("playersource");
var player = document.getElementById("player");
var shuffle = false;
var imagesContainer = document.getElementById("imagesContainer");

var req = new XMLHttpRequest();
var filesJson;
req.open("GET",/*"https://s3-sa-east-1.amazonaws.com/wixtestbucket/*/"files.json");
req.addEventListener("load",function () {
    filesJson = JSON.parse(this.responseText);
    songsAmount = parseInt(filesJson.songs);
    imagesAmount = parseInt(filesJson.images);
    shuffle = filesJson.shuffle;
    init();
});
req.send();

var jssor_1_slider_init = function() {

    var jssor_1_SlideshowTransitions = [
        {$Duration:4000,$Opacity:2,$Brother:{$Duration:4000,$Opacity:2}}
    ];
    var jssor_1_options = {
        $AutoPlay: true,
        $Idle: 10000,
        $FillMode: 1,
        $SlideshowOptions: {
            $Class: $JssorSlideshowRunner$,
            $Transitions: jssor_1_SlideshowTransitions,
            $TransitionsOrder: 1
        },
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $BulletNavigatorOptions: {
            $Class: $JssorBulletNavigator$
        }
    };

    var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
};


function init() { //This code starts everything as soon as files.json is read
    trackNumber = 0;

    for(var j = 0; j < imagesAmount ; j++){

        var div = document.createElement("div");
        var img = document.createElement("img");
        img.setAttribute("data-u","image");
        img.src = "img/" + j + ".jpg";
        div.appendChild(img);
        imagesContainer.appendChild(div);

    }
    jssor_1_slider_init();
    loadTrack(trackNumber);
};

player.addEventListener("ended", nextSong, false);


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
}

function loadTrack(i) { //load only no play
    var src = /*"https://s3-sa-east-1.amazonaws.com/wixtestbucket/music/" +*/ "music/" + i + ".mp3";
    source.src = src;
    setCurrent(i);
    player.load();
}

function playTrack(i){ //load and play
    loadTrack(i);
    player.play();
}

function setCurrent(i){ //Sets a class selector of song-current for styling;
    var current = document.querySelector(".song-current");
    if(current){
        current.classList.remove("song-current");
        document.getElementById(i).classList.add("song-current");
    }
}

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
    console.innerHTML += input + "<br>";
}