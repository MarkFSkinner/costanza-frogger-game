//var stop = false;
var win = false;
var kills = 0;
var score = 0;
var level = 1;
var highScore = 0;
//var time = 30;
var countdown;
var timer;
var currentTime;
var muted = false;
var invincible = false;
var themePaused = false;
var killBonus = 0;
var hit = false;



// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    //this.sprite = 'images/enemy-bug.png';
    //this.sprite = 'images/frank_main.png';
    this.sprite = ['images/frank_main.png', 'images/estelle.png', 'images/susan.png'];
    this.x_pos = [-150, 700];
    this.y_pos = [128, 211, 294];
    //this.speedRange = [150, 600];
    this.speedRange = [50, 300];
    //this.speed = Math.floor(Math.random() * 250 + 100);

    this.reset();
};


Enemy.prototype.reset = function() {
    //var start_pos = this.x_pos[0];
    //this.x = start_pos;
    this.x = this.x_pos[0];
    this.y = this.getRandom(this.y_pos);
    this.image = this.getRandom(this.sprite);
    /*this.y = this.getRandomY();
    this.image = this.getRandomEnemy();*/
    this.speed = this.getRandomSpeed();

}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (game.currentState !== states.running) {
        return
    }
    var max_pos = this.x_pos[1];
    this.x += this.speed * dt;

    if (this.x > max_pos) {
        this.reset();
    }


};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};

Enemy.prototype.getRandom = function (thing) {
    return thing[Math.floor(Math.random() * thing.length)];
}

/*Enemy.prototype.getRandomY = function () {
    return this.y_pos[Math.floor(Math.random() * this.y_pos.length)];
}

Enemy.prototype.getRandomEnemy = function () {
    return this.sprite[Math.floor(Math.random() * this.sprite.length)];
}*/

Enemy.prototype.getRandomSpeed = function() {
    var minSpeed = this.speedRange[0],
        maxSpeed = this.speedRange[1];

    return Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    //this.sprite = 'images/char-boy.png';
    //this.sprite = 'images/costanza.png';
    //this.x;
    //this.y;
    this.reset();
    this.winCount = 2;
}

Player.prototype.update = function() {
    //var me = this;
    //if (me.y < 100) {
    if (game.currentState !== states.running) {
        return
    }
    if (this.y < 100) {
        allEnemies.forEach(function(enemy) {
            enemy.speed = 0;
        })
        console.log("WINNER!");
        //this.showButton('#win');
        game.showButton('#win');
        this.winCount += 1;
        if (this.winCount % 3 === 0) {
            game.sounds[3].currentTime = 2;
            //game.sounds[3].play();
            game.controlSounds(3);
        }
        //stop = true;
        win = true;
        clearInterval(timer);
         if (themePaused === true) {
            game.sounds[10].pause();
            game.sounds[5].currentTime = 0;
            game.controlSounds(5);
            themePaused = false;
        }
        invincible = false;
        /*$('#win').removeClass('hidden')
        $(function() {
            $('#win').click(function() {
                me.reset();
                allEnemies.forEach(function(enemy) {
                    enemy.reset();
                })
                $('#win').addClass('hidden')
            });
        });*/
        //alert("IT'S THE SUMMER OF GEORGE!!!! YOU WIN!");
        //this.reset();
    }
    //win = false;
    this.checkCollison();
}


Player.prototype.checkCollison = function() {
    //var me = this;
    killBonus = 0;
    for (i = 0; i < allEnemies.length; i++) {
        enemy = allEnemies[i];
    //allEnemies.forEach(function(enemy) {
        //if (enemy.y == (me.y - 8) && invincible === false) {
        //if (enemy.y == (me.y - 8)) {
        if (enemy.y === (player.y - 8)) {
            if (enemy.x >= player.x - 75 && enemy.x <= player.x + 75) {

                if(invincible === true) {
                    enemy.x = enemy.x_pos[1];
                    killBonus = 20;
                    score += killBonus;
                    game.renderScore();
                    game.controlSounds(11);
                }
                else {
                    hit = true;
                    /*clearInterval(timer);
                    allEnemies.forEach(function(enemy) {
                        enemy.speed = 0;
                    })
                    //me.sprite = 'images/costanza_scared.png';
                    player.sprite = 'images/costanza_scared.png';
                    //console.log("LOSER!");
                    //me.showButton('#lose');
                    game.showButton('#lose');

                    //game.sounds[0].play();

                    kills += 1;
                    if (kills === 1) {
                        $('#heart3').addClass('hidden');
                        $('#second-kill').addClass('hidden');
                        $('#third-kill').addClass('hidden');
                        //game.sounds[0].play();
                        game.controlSounds(0);
                    }
                    else if (kills === 2) {
                        $('#heart2').addClass('hidden');
                        $('#first-kill').addClass('hidden');
                        $('#second-kill').removeClass('hidden');
                        //game.sounds[1].play();
                        game.controlSounds(1);
                    } else {
                        $('#heart1').addClass('hidden');
                        $('#second-kill').addClass('hidden');
                        $('#third-kill').removeClass('hidden');
                        game.sounds[5].pause();
                        game.sounds[2].currentTime = 27;
                        //game.sounds[2].play();
                        game.controlSounds(2);

                        setTimeout(function(){ endAudio() }, 4500);
                        function endAudio() {
                            game.sounds[4].currentTime = 108;
                            //game.sounds[4].play();
                            game.controlSounds(4);
                        }

                    }*/

                }
                break;
                //stop = true;
                //enemy.x_pos = -150;
                //alert("THESE PRETZELS ARE MAKING ME THIRSTY!!!! YOU LOSE!");
                //me.reset();

                /*$('#lose').removeClass('hidden')
                $(function() {
                    $('#lose').click(function() {
                        me.reset();
                        allEnemies.forEach(function(enemy) {
                            enemy.reset();
                        })
                        $('#lose').addClass('hidden')
                    });
                });*/
            }
        }
    }//)
}

Player.prototype.reset = function() {
    this.x = 220;
    this.y = 468;
    this.sprite = 'images/costanza.png';
    //this.renderScore();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var moveLeft = true;
var moveRight = true;
var moveUp = true;
var moveDown = true;

Player.prototype.handleInput = function(key) {
    //if (stop === false) {
    if (game.currentState === states.running) {
        if (key === 'left' && this.x > 50) {
            this.checkMove();
            //console.log("Move Left is " + moveLeft);
            //console.log(charm.image);
            if (moveLeft === true) {
                this.x -= 100;
                moveRight = true;
                moveUp = true;
                moveDown = true;
            }
        } else if (key === 'right' && this.x < 400) {
            this.checkMove();
            if (moveRight === true) {
                this.x += 100;
                moveLeft = true;
                moveUp = true;
                moveDown = true;
            }
        } else if (key === 'up' && this.y > 100) {
            this.checkMove();
            if (moveUp === true) {
                this.y -= 83;
                moveLeft = true;
                moveRight = true;
                moveDown = true;
            }
        } else if (key === 'down' && this.y < 400) {
            this.checkMove();
            if (moveDown === true) {
                this.y += 83;
                moveLeft = true;
                moveRight = true;
                moveUp = true;
            }
        }
    }
}

Player.prototype.checkMove = function() {
    if (charm.image === 'images/Rock.png') {
        if (charm.y === this.y - 68) {
            if (charm.x === this.x - 119){
            return moveLeft = false;
            }
            else if (charm.x === this.x + 81) {
                return moveRight = false;
            }
        }
        else if (charm.x === this.x - 19){
            if (charm.y === this.y - 151) {
                return moveUp = false;
            }
            else if (charm.y === this.y + 15) {
                return moveDown = false;
            }
        }
    }
}



var Charmes = function() {
    this.sprite = ['images/Heart.png', 'images/Rock.png',
    'images/Gem Blue.png','images/Gem Green.png', 'images/Star.png'];
    //this.numLives = 3;
    this.x_pos = [1, 101, 201, 301, 401];
    //this.y_pos = [80, 163, 245];
    this.y_pos = [68, 151, 234];
    this.reset();
}


Charmes.prototype.reset = function() {
    this.x = this.getRandom(this.x_pos);
    this.y = this.getRandom(this.y_pos);
    this.image = this.getRandom(this.sprite);

    /*switch (this.image) {
        case 'images/Heart.png':
            break;
        case 'images/Rock.png':
            if (charm.y == (player.y + 83) {
                move = false;
                //can't move up
            }
            else if charm.y == (player.y - 83)) {
                //can't move down
                move = false;
            }
            else if (charm.x == player.x - 100) {
                //can't move right
                move = false;
            }
            else if (charm.x == player.x + 100) {
                //can't move left
                move = false;
            }
            break;
        case 'images/Gem Blue.png':
            break;
        case 'images/Gem Green.png':
            break;
    }*/
}


/*Charmes.prototype.update = function() {
    //this.x = this.getRandom(this.x_pos);
    //this.y = this.getRandom(this.y_pos);
}*/

Charmes.prototype.getRandom = function (thing) {
    return thing[Math.floor(Math.random() * thing.length)];
}

Charmes.prototype.render = function() {
    if (game.currentState !== states.running) {
        return
    }
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
    //ctx.drawImage(Resources.get(this.sprite), this.x[1], this.y);
    //ctx.drawImage(Resources.get(this.sprite), this.x[2], this.y);
}



var states = {
    running: 0,
    stopped: 1
}

var Game = function() {
    //this.currentState = states.running;
    this.currentState = states.stopped;
    this.currentButton = "";
    this.startTime = 20;
    //this.reset();
    this.sounds = [
        new Audio("http://audiofiles2.jerryseinfeld.nl/upset.wav"),
        new Audio("http://audiofiles2.jerryseinfeld.nl/independent.mp3"),
        new Audio("http://audiofiles2.jerryseinfeld.nl/worlds.mp3"),
        new Audio("http://audiofiles2.jerryseinfeld.nl/sumrgrge.wav"),
        new Audio("http://audiofiles1.jerryseinfeld.nl/frogger.mp3"),
        new Audio("http://www.televisiontunes.com/uploads/audio/Seinfeld.mp3"),
        new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_coin.wav"),
        new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_1-up.wav"),
        new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_warning.wav"),
        new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_powerup.wav"),
        new Audio("http://www.gamethemesongs.com/uploads/audio/Super%20Mario%20Kart%20-%20Star%20Power.mp3"),
        new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_kick.wav")
    ];
    this.sounds[5].addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    this.sounds[5].play();
}






Game.prototype.reset = function() {
    countdown = true;
    player.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    })
    charm.reset();
    this.currentState = states.running;
    this.renderScore();
    //this.renderTime();
    this.updateTime();
    if (kills === 0) {
        $('#heart3').removeClass('hidden');
        $('#heart2').removeClass('hidden');
        $('#heart1').removeClass('hidden');
        $('#first-kill').removeClass('hidden');
    }
    var timeText = this.startTime.toString();
    $('.time-num').text(timeText);
    invincible = false;
    if (themePaused === true) {
        game.sounds[10].pause();
        game.sounds[5].currentTime = 0;
        game.controlSounds(5);
        themePaused = false;
    }
    hit = false;
}




$(document).keyup(function(event){
    if (game.currentState === states.stopped) {
        if(event.keyCode == 13){
            //console.log(game.currentButton + "CLICKED 1");
            $(game.currentButton).click();
            event.preventDefault();
            //console.log(game.currentButton + "CLICKED 2");
            //game.reset();
            //return false;
        }
    }
});


$("#win").click(function() {
    console.log("win was clicked");
    /*me.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    })*/
    game.reset();
    $('#win').addClass('hidden')
    //stop = false;
});

$("#lose").click(function() {
    console.log("lose was clicked");
    /*me.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    })*/
    game.reset();
    $('#lose').addClass('hidden')
    if (kills === 0 && game.currentState === states.running) {
        game.sounds[5].currentTime = 0;
        game.sounds[5].volume = 0.25;
        //game.sounds[5].play();
        game.controlSounds(5);
    }
    //stop = false;
});



$("#start-game").click(function() {
    game.currentState = states.running;
    $('#start-game').addClass('hidden')
    game.sounds[5].volume = 0.25;
    //game.sounds[5].pause();
    game.reset();
    //allEnemies.reset();
});

$(document).keyup(function(event){
    if (game.currentState === states.stopped) {
        if(event.keyCode == 13){
            $('#start-game').click();
            event.preventDefault();
        }
    }
});



Game.prototype.showButton = function(button) {
    //input = "'#" + button + "'"
    //console.log(input);
    //var me = this;
    //var it = this;
    this.currentState = states.stopped;
    this.currentButton = button;
    $(this.currentButton).removeClass('hidden')
    //$(function() {
        /*$(document).keyup(function(event){
            if(event.keyCode == 13){
                $(button).click();
                event.preventDefault();
                console.log("making event yo!");
                //return false;
            }
        });*/
        //$(button).click(function() {
        //    console.log("button was clicked");
            /*me.reset();
            allEnemies.forEach(function(enemy) {
                enemy.reset();
            })*/
        //    it.reset();
        //    $(button).addClass('hidden')
            //stop = false;
        //});
    //});
}




Game.prototype.updateScore = function() {
    /*var bonus = 0;
    if (charm.x >= player.x - 75 && charm.x <= player.x + 75) {
        bonus = 20;
        score += bonus;
    }*/
    if (win === true) {
        score = score + (level * 50) + currentTime;
        level += 1;
        win = false;
        allEnemies.forEach(function(enemy) {
            enemy.speedRange[0] = (enemy.speedRange[0] + 20);
            enemy.speedRange[1] = (enemy.speedRange[1] + 30);
        })
    }
    if (kills > 2) {
        if (score > highScore) {
            highScore = score;
        }
        score = 0;
        level = 1;
        kills = 0;
        allEnemies.forEach(function(enemy) {
            enemy.speedRange[0] = 50;
            enemy.speedRange[1] = 400;
        })
    }
}

Game.prototype.renderScore = function() {
    this.updateScore();
    var scoreText = score.toString();
    $('.score-num').text(scoreText);
    var levelText = level.toString();
    $('.level-num').text(levelText);
    var highScoreText = highScore.toString();
    $('.high-score-num').text(highScoreText);
}

Game.prototype.update = function() {
    var bonus = 0;
    if (charm.y === (player.y - 68) && hit === false) {
        if (charm.x >= player.x - 19 && charm.x <= player.x + 19) {
            if (charm.image === 'images/Star.png') {
                bonus = 100;
                invincible = true;
                game.controlSounds(9);
                player.sprite = 'images/george_hair_shine.png';
                game.sounds[10].currentTime = 38;
                game.sounds[10].volume = 0.5;
                game.controlSounds(10);
                game.sounds[5].pause();
                themePaused = true;
            }
            else if (charm.image === 'images/Gem Green.png') {
                bonus = 50;
                game.controlSounds(6);
            }
            else if (charm.image === 'images/Gem Blue.png') {
                bonus = 20;
                game.controlSounds(6);
            }
            else if (charm.image === 'images/Heart.png') {
                if (kills === 0) {
                    bonus = 200;
                    game.controlSounds(6);
                }
                else if (kills === 1) {
                    $('#heart3').removeClass('hidden');
                    kills = 0;
                    game.controlSounds(7);
                }
                else if (kills === 2) {
                    $('#heart2').removeClass('hidden');
                    kills = 1;
                    game.controlSounds(7);
                }
            }
            score = score + bonus;
            charm.x = 600;
            this.renderScore();
        }
    }
    if (player.sprite === 'images/george_hair_shine.png' && currentTime % 2 === 0) {
        player.sprite = 'images/george_hair.png';
    }
    else if (player.sprite === 'images/george_hair.png' && currentTime % 2 !== 0) {
        player.sprite = 'images/george_hair_shine.png';
    }
}


Game.prototype.updateTime = function() {
    //if (this.currentState === states.running) {
    if (countdown === true) {
        timer = setInterval(function(){myTimer()}, 1000);
        currentTime = this.startTime;
        //var that = this;
        function myTimer() {
            //var startTime = new Date();
            if (currentTime > 1) {
                currentTime -= 1;
                //console.log(currentTime);
                var timeText = currentTime.toString();
                $('.time-num').text(timeText);
                if (currentTime === 3) {
                    game.controlSounds(8);
                }
            }
            else /*if (currentTime === 0)*/ {
                game.killed();

                /*clearInterval(timer);
                allEnemies.forEach(function(enemy) {
                    enemy.speed = 0;
                })
                player.sprite = 'images/costanza_scared.png';
                console.log("LOSER!");
                game.showButton('#lose');
                kills += 1;
                if (kills === 1) {
                    $('#heart3').addClass('hidden');
                    $('#second-kill').addClass('hidden');
                    $('#third-kill').addClass('hidden');
                    //game.sounds[0].play();
                    game.controlSounds(0);
                }
                else if (kills === 2) {
                    $('#heart2').addClass('hidden');
                    $('#first-kill').addClass('hidden');
                    $('#second-kill').removeClass('hidden');
                    //game.sounds[1].play();
                    game.controlSounds(1);
                } else {
                    $('#heart1').addClass('hidden');
                    $('#second-kill').addClass('hidden');
                    $('#third-kill').removeClass('hidden');
                    game.sounds[5].pause();
                    game.sounds[2].currentTime = 27;
                    //game.sounds[2].play();
                    game.controlSounds(2);

                    setTimeout(function(){ endAudio() }, 4500);
                    function endAudio() {
                        game.sounds[4].currentTime = 108;
                        //game.sounds[4].play();
                        game.controlSounds(4);
                    }

                }*/
                countdown = false;
                currentTime = this.startTime;
            }
        }
        /*var stopTimer = function() {
            clearInverval(timer);
        }
        stopTimer();*/
        //this.stopTimer();
    }
}

Game.prototype.killed = function() {
    clearInterval(timer);
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
    })
    player.sprite = 'images/costanza_scared.png';
    game.showButton('#lose');

    kills += 1;
    if (kills === 1) {
        $('#heart3').addClass('hidden');
        $('#second-kill').addClass('hidden');
        $('#third-kill').addClass('hidden');
        //Play George Upset Audio
        game.controlSounds(0);
    }
    else if (kills === 2) {
        $('#heart2').addClass('hidden');
        $('#first-kill').addClass('hidden');
        $('#second-kill').removeClass('hidden');
        //Play Independent Geroge Audio
        game.controlSounds(1);
    } else {
        $('#heart1').addClass('hidden');
        $('#second-kill').addClass('hidden');
        $('#third-kill').removeClass('hidden');
        //Pause Seinfeld Theme Audio
        game.sounds[5].pause();
        //Play Geroge Divided Audio
        game.sounds[2].currentTime = 27;
        game.controlSounds(2);

        //Play Game Over Audio after George Divided Ends
        setTimeout(function(){ endAudio() }, 4500);
        function endAudio() {
            game.sounds[4].currentTime = 108;
            game.controlSounds(4);
        }
    }
}


Game.prototype.controlSounds = function(n) {
    if (muted === false) {
        this.sounds[n].play();
    }
}

$("#mute").click(function() {
    muted = true;
    //console.log("the game is muted = " + muted);
    $("#mute").addClass('hidden');
    $("#unmute").removeClass('hidden');
    game.sounds[5].pause();
    game.sounds[10].pause();
});

$("#unmute").click(function() {
    muted = false;
    //console.log("the game is muted = " + muted);
    $("#unmute").addClass('hidden');
    $("#mute").removeClass('hidden');
    if (invincible === true) {
        game.controlSounds(10);
    }
    else {
        game.sounds[5].play();
    }
});


/*Game.prototype.stopTimer = function() {
    clearInverval(timer);
}*/



/*Game.prototype.renderTime = function() {
    this.updateTime();
    var timeText = this.currentTime.toString();
    $('.time-num').text(timeText);
}*/



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


var frank = new Enemy();
var estelle = new Enemy();
var susan = new Enemy();
var allEnemies = [frank, estelle, susan];

var player = new Player();
var charm = new Charmes();

var game = new Game();


//var life2 = new Lives();
//var life3 = new Lives();

