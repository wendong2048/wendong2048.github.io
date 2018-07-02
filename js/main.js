var board= new Array();
var score=0;
var hasConflicted =new Array();

var startx=0;
var starty=0;
var startTime = 0;
var endx=0;
var endy=0;
var endTime = 0;
var best;
var easterEgg = ['up','up','down','down','left','left','right','right','restart'];
var instructSequence = [];
$(document).ready(function () {

    mode = localStorage.getItem('mode')?localStorage.getItem('mode'):'wendong';
    prepareForMobile();
    uglyPreloading();
    if(mode == 'wendong') {
        happyBrithdayAnim();
    } else{
      $('body').css('background-color','#FFF')
      $('#c').css('display', 'none')
    }
    
    best = localStorage.getItem("best-score") ? parseInt(localStorage.getItem("best-score")) : 0
    $("#best").text(best);

    init();
    generateOneNumber();
    generateOneNumber();
});




function prepareForMobile(){
    if(navigator.userAgent.match(/(ipad|iPhone|iPod|Android|ios|ONEPLUS)/i)){
        document.querySelector('html').style.fontSize = document.body.clientWidth / 375* 10 + 'px';
        // document.querySelector('body').style['margin-top'] = `${(1000 - documentHeight)/2}px`;
        if (screen.height == 812 && screen.width == 375) {
             document.querySelector('body').style['margin-top'] = '300px';
        }
        if (navigator.userAgent.match(/(ipad)/i)) {
             document.querySelector('body').style['margin-top'] = '-110px';
        }
    }
    else {
        document.querySelector('html').style.fontSize = document.body.clientWidth / 375 *3  + 'px';
        gridContainerWidth=500;
        cellSapce=20;
        cellSideLength=100;
        document.querySelector('#best-cell').style['margin-top'] = '21rem';
        document.querySelector('#best-cell').style['margin-left'] = '5rem';
        document.querySelector('#grid-container').style['top'] = '5rem';

    }


    $('#grid-container').css('width',gridContainerWidth-2*cellSapce);
    $('#grid-container').css('height',gridContainerWidth-2*cellSapce);
    $('#grid-container').css('padding',cellSapce);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}


function easterEggDetector (instrct) {
    instructSequence.push(instrct)
    for (let i = 0; i < instructSequence.length; i++) {
        if (instructSequence[i] != easterEgg[i]) {
           instructSequence = []
        
        }
    }
    if ((easterEgg.length - 1) == instructSequence.length
         && easterEgg[instructSequence.length] == 'restart'){
        $('#restart-cell').css('background-color','#ff0b00cc')
    } else {
        $('#restart-cell').css('background-color','#1982efcc')
    }

    if (easterEgg.length == instructSequence.length) {
        mode = mode == 'wendong' ? 'tong' : 'wendong'
        localStorage.setItem('mode',mode)
        uglyPreloading();
    }
} 



function init(){

    for(var i= 0 ;i< 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-"+ i +"-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    for(var i= 0 ;i<4;i++) {
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView();

    score=0;
    $("#score").text(score);
}


function uglyPreloading () {
  let innerHTML = '';

  for (i = 1; i <= 11; i++) {
    let number = Math.pow(2, i)
    innerHTML += `<div style="background-image: url('img/${(mode == 'tong' ? 'tong/': '')}${number}.png')"></div>`
  }

  $('.uglyPreloading').html(innerHTML)

}

function showNumber(i,j,randNumber){
    var numberCell=$("#number-cell-"+ i +"-" + j);
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    // numberCell.text(randNumber);
    if (getNumberDisplayImage(randNumber))
        numberCell.css('background-image',getNumberDisplayImage(randNumber));
    else
        numberCell.text(randNumber);

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);

}
function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$("#number-cell-"+fromx+"-"+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updateScore(score){
    $("#score").text(score);
    if(best <= score) {
        $("#best").text(score);
        localStorage.setItem("best-score",score)
    }
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i= 0 ;i<4;i++) {
        for (var j = 0; j < 4; j++) {
           $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $("#number-cell-"+ i +"-" + j);

            if(board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength*0.5);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength*0.5);
                theNumberCell.text("");
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                if (getNumberDisplayImage(board[i][j]))
                    theNumberCell.css('background-image',getNumberDisplayImage(board[i][j]));
                else
                    theNumberCell.text(board[i][j]);
                // @Insert img
            }
            hasConflicted[i][j]=false;

        }

    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}



function generateOneNumber(){
    if(nospace(board)){
        return false;
    }

    //audioPlay();

    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    var times=0;
    while (times<50){
        if (board[randx][randy]==0)
            break;
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
         for(var i=0;i<4;i++){
             for(var j=0;j<4;j++){
                 if(board[i][j]==0){
                     randx=i;
                     randy=j;
                 }
             }
         }
    }
    var randNumber=Math.random()<0.5? 2 : 4;
    board[randx][randy]=randNumber;
    showNumber(randx,randy,randNumber);
    return true;
}


$(document).keydown((event) => {

    switch (event.keyCode){

        case 37:  //left
            easterEggDetector('left');
            if(moveLeft()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                    }
                },210);


                setTimeout("isgameover()",300);
            }
            break;
        case 38:  //up
            easterEggDetector('up');
            if(moveUp()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                    }
                },210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39:  //right
            easterEggDetector('right');
            if(moveRight()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                    }
                },210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:   //down
            easterEggDetector('down');
            if(moveDown()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                    }
                },210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;

    }

});

document.addEventListener('touchstart',function(event){

    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
    let now = new Date();
    startTime = now.getTime();
});


document.addEventListener('touchend',(event)=> {

    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;
    let now = new Date();
    endTime = now.getTime();
    var deltaTime = endTime-startTime;
    var deltax=endx-startx;
    var deltay=endy-starty;


    if(Math.abs(deltax)<0.1*documentWidth&&Math.abs(deltay)<0.1*documentWidth){
        return ;
    }

    if(Math.abs(deltax)>Math.abs(deltay)){
        if(deltax>0){
          easterEggDetector('right');
            if(moveRight()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                    }
                },210);
                setTimeout("isgameover()",300);
            }

        }else{
          easterEggDetector('left');
            if(moveLeft()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                        //audioPlay();
                    }
                },210);
                setTimeout("isgameover()",300);
            }

        }
    }else{
        if(deltay>0){
             easterEggDetector('down')
            if(moveDown()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                       // audioPlay();
                    }
                },210);
                setTimeout("isgameover()",300);
            }

        }else{
           easterEggDetector('up')
            if(moveUp()){
                setTimeout(() => {
                    if(generateOneNumber()) {
                       // audioPlay();
                    }
                },210);
                setTimeout("isgameover()",300);
            }

        }

    }
});

