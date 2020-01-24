var bird = document.getElementById('bird');
var birdMouth = document.querySelector('.mouth');
var birdTop = 300;
bird.style.left = '100px';
var birdLeft = Number(bird.style.left.replace('px', ''));
var containerHeight = Number(getComputedStyle(document.querySelector('#container')).height.replace('px', ''));
var birdWidth = Number(getComputedStyle(document.querySelector('#bird')).width.replace('px', ''));
var birdHeight = Number(getComputedStyle(document.querySelector('#bird')).height.replace('px', ''));
var upObstaclePos = {};
var downObstaclePos = {};
var foodPos = {};
var score = 0;
var counter = 0;
var randomObstacle;
var randomFood;
var stater;

function obstacle() { 
    this.obstacleTopElement = document.createElement('div');
    this.obstacleTopElement.className = 'obstacle top';
    this.obstacleTopElement.style.left = '800px';
    this.obstacleTopElement.style.height = Math.floor(Math.random() * 410 + 50) + 'px';

    this.obstacleBottomElement = document.createElement('div');
    this.obstacleBottomElement.className = 'obstacle bottom';
    this.obstacleBottomElement.style.left = '800px';
    this.obstacleBottomElement.style.height = Math.floor(Math.random() * 410 + 50) + 'px';
    this.obstacleBottomElement.style.bottom = 0;

    this.defineBottomHeight = function () {
        do {
            this.obstacleBottomElement.style.height = Math.floor(Math.random() * 410 + 50) + 'px';
        } while (Number((this.obstacleBottomElement.style.height).replace('px', '')) + Number((this.obstacleTopElement.style.height).replace('px', '')) > 520);
    }

    document.querySelector('#container').appendChild(this.obstacleTopElement);
    document.querySelector('#container').appendChild(this.obstacleBottomElement);
    return {
        first: this.obstacleTopElement,
        second: this.obstacleBottomElement,
        third: this.defineBottomHeight(),
    }
}

function createFood() {
    this.foodElement = document.createElement('div');
    this.foodElement.className = 'food';
    this.foodElement.style.top = Math.floor(Math.random() * 570) + 'px';

    document.querySelector('#container').appendChild(this.foodElement);
    var that = this;
 
    this.foodPosDefine = function () {
        definePos();
        this.foodElement.style.left = Math.floor(Math.random() * 200 + 600) + 'px';
        
        if (typeof (upObstaclePos[0]) !== "undefined") {

            document.querySelectorAll('.top').forEach(function (value, index) {

                if (Number(upObstaclePos[index]['left'].replace('px', '')) < Number(that.foodElement.style.left.replace('px', '')) +
                    Number(getComputedStyle(document.querySelector('.food')).width.replace('px', '')) &&
                    Number(that.foodElement.style.left.replace('px', '')) < Number(upObstaclePos[index]['left'].replace('px', '')) + 50) {
                    return that.foodPosDefine();
                } 
            })
            return this.foodElement.style.left;
        }
    }

    return {
        first: this.foodElement,
        second: this.foodPosDefine(),
    }
}

function gameOver() {

    clearInterval(obstaclePositionChanger);
    document.querySelector('.game-over').style.display = 'block';
    stater = 'gameOver';
}

function increaseScore() {
    score++;
    document.querySelector('.score-table').innerHTML = 'SCORE: ' + score;
}

function definePos() {
    var obstaclewidth = Number(getComputedStyle(document.querySelector('.obstacle')).width.replace('px', ''));
    var foodWidth = Number(getComputedStyle(document.querySelector('.food')).width.replace('px', ''));
    var foodHeight = Number(getComputedStyle(document.querySelector('.food')).height.replace('px', ''));

    document.querySelectorAll('.top').forEach(function (value, index) { 
        upObstaclePos[index] = {
            left: value.style.left,
            height: value.style.height,
        }

        downObstaclePos[index] = {
            left: document.querySelectorAll('.bottom')[index].style.left,
            height: document.querySelectorAll('.bottom')[index].style.height,
        }

        foodPos[index] = {
            left: document.querySelectorAll('.food')[index].style.left,
            top: document.querySelectorAll('.food')[index].style.top,
        }

        if (birdLeft + birdWidth >= Number(upObstaclePos[index]['left'].replace('px', '')) && birdLeft + birdWidth <= Number(upObstaclePos[index]['left'].replace('px', '')) + obstaclewidth && birdTop < Number(upObstaclePos[index]['height'].replace('px', ''))) {
            gameOver();
          

        } else if (birdLeft + birdWidth >= Number(downObstaclePos[index]['left'].replace('px', '')) && birdLeft + birdWidth <= Number(downObstaclePos[index]['left'].replace('px', '')) + obstaclewidth && birdTop + birdHeight > containerHeight - Number(downObstaclePos[index]['height'].replace('px', ''))) {
            gameOver();
          

        } else if (birdLeft + birdWidth === Number(downObstaclePos[index]['left'].replace('px', '')) && birdTop + birdHeight < containerHeight - Number(downObstaclePos[index]['height'].replace('px', ''))) {
            increaseScore();
        }

        if (birdLeft + birdWidth > Number(foodPos[index]['left'].replace('px', '')) && birdLeft < Number(foodPos[index]['left'].replace('px', '')) + foodWidth && (birdTop < Number(foodPos[index]['top'].replace('px', '')) + foodHeight && birdTop + birdHeight > Number(foodPos[index]['top'].replace('px', '')))) {
            increaseScore();
            document.querySelectorAll('.food')[index].remove();
            birdMouth.classList.remove('animation-on');
            void birdMouth.offsetWidth;
            birdMouth.classList.add('animation-on');
            new createFood;
        }
    });
}

function changeObstaclePos() {
    counter++;
    if (Number.isInteger(counter / 333)) {
        gameFlow();
    }
    document.querySelectorAll('.obstacle').forEach(function (value) {
        value.style.left = ((value.style.left).replace('px', '') - 1) + 'px';
    })

    document.querySelectorAll('.food').forEach(function (value) {
        value.style.left = ((value.style.left).replace('px', '') - 1) + 'px';
    })

    if (randomObstacle) {
        definePos();
    }
}

function gameFlow() { 

    var obstacleAll = document.querySelectorAll('.obstacle');
    if (obstacleAll.length > 4) {

        obstacleAll[0].remove();
        obstacleAll[1].remove();
        document.querySelectorAll('.food')[0].remove();
    }
    randomObstacle = new obstacle; 
    new createFood;
}

function birdPositionChanger() {
   
    var keyState = {};

    window.addEventListener('keydown', function (e) {
        keyState[e.keyCode || e.which] = true;
    }, true);

    window.addEventListener('keyup', function (e) {
        keyState[e.keyCode || e.which] = false;
    }, true);

    function keyEvent() {

        if (stater === 'gameOver') {
        return
        }
        if (birdTop > 0 && (keyState[38] || keyState[87])) { 

            birdTop -= 2;
            bird.style.top = birdTop + 'px';
         
        }
        if (birdTop + birdHeight < 600 && (keyState[40] || keyState[83])) {

            birdTop += 2;
            bird.style.top = birdTop + 'px';
        
        }
        if (birdLeft + birdWidth < 800 && (keyState[39] || keyState[68])) {

            birdLeft += 2;
            bird.style.left = birdLeft + 'px';

        }
        if (birdLeft > 0 && (keyState[37] || keyState[65])) {

            birdLeft -= 2;
            bird.style.left = birdLeft + 'px';
        }
        setTimeout(keyEvent, 1);
    }

    clickEvent = function () {
        if (stater === 'gameOver') {
            return
            }
        bird.addEventListener('click', function () {
            if (birdTop >= 30) {
                birdTop -= 30;
            } else if (birdTop === 0) {
                gameOver();
            }
            bird.style.top = birdTop + 'px';
        })
}
    return { 
        first: keyEvent(),
        second: clickEvent(),
    }
}


birdPositionChanger();

var obstaclePositionChanger = setInterval(changeObstaclePos, 6);
