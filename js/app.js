var countdown;
var timer;
var timeNow;

var kills = 0;
var score = 0;
var level = 1;
var highScore = 0;
var killBonus = 0;

var win = false;
var muted = false;
var invincible = false;
var themePaused = false;
var hit = false;



// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = [
        'images/frank.png',
        'images/estelle.png',
        'images/susan.png'
    ];
    this.x_pos = [-150, 700];
    this.y_pos = [128, 211, 294];
    this.speedRange = [50, 300];
    this.reset();
};


Enemy.prototype.reset = function() {
    this.x = this.x_pos[0];
    this.y = this.getRandom(this.y_pos);
    this.image = this.getRandom(this.sprite);
    this.speed = this.getRandomSpeed();
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (game.currentState !== states.running) {
        return;
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

Enemy.prototype.getRandomSpeed = function() {
    var minSpeed = this.speedRange[0],
        maxSpeed = this.speedRange[1];
    return Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.reset();
    this.winCount = 2;
}


Player.prototype.reset = function() {
    this.x = 220;
    this.y = 468;
    this.sprite = 'images/costanza.png';
}


Player.prototype.update = function() {
    //Freeze player when game is stopped
    if (game.currentState !== states.running) {
        return;
    }
    //What to do when player reaches the top
    if (this.y < 100) {
        allEnemies.forEach(function(enemy) {
            enemy.speed = 0;
        })
        game.showButton('#win');
        //Only play win audio the first time, then every 3rd time
        this.winCount += 1;
        if (this.winCount % 3 === 0) {
            //Play Summer of George Audio
            game.sounds[3].currentTime = 2;
            game.controlSounds(3);
        }
        win = true;
        //Reset timer
        clearInterval(timer);
        if (themePaused === true) {
            //Pause Star Power Audio
            game.sounds[10].pause();
            //Play Seinfeld Theme
            game.sounds[5].currentTime = 0;
            game.controlSounds(5);
            themePaused = false;
        }
        //End star power when player reaches the top
        invincible = false;
    }
    this.checkCollison();
}


Player.prototype.checkCollison = function() {
    killBonus = 0;
    for (i = 0; i < allEnemies.length; i++) {
        enemy = allEnemies[i];
        if (enemy.y === (player.y - 8)) {
            if (enemy.x >= player.x - 75 && enemy.x <= player.x + 75) {
                if(invincible === true) {
                    enemy.x = enemy.x_pos[1];
                    killBonus = 20;
                    score += killBonus;
                    game.renderScore();
                    //Play enemy kill audio
                    game.controlSounds(11);
                }
                else {
                    hit = true;
                    game.killed();
                }
                //End loop after one enemy is hit
                break;
            }
        }
    }
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var moveLeft = true;
var moveRight = true;
var moveUp = true;
var moveDown = true;

Player.prototype.handleInput = function(key) {
    if (game.currentState === states.running) {
        if (key === 'left' && this.x > 50) {
            this.checkMove();
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
    if (gem.image === 'images/Rock.png') {
        if (gem.y === this.y - 68) {
            if (gem.x === this.x - 119){
            return moveLeft = false;
            }
            else if (gem.x === this.x + 81) {
                return moveRight = false;
            }
        }
        else if (gem.x === this.x - 19){
            if (gem.y === this.y - 151) {
                return moveUp = false;
            }
            else if (gem.y === this.y + 15) {
                return moveDown = false;
            }
        }
    }
}



var Gems = function() {
    this.sprite = [
        'images/Heart.png',
        'images/Rock.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Star.png'
    ];
    this.x_pos = [1, 101, 201, 301, 401];
    this.y_pos = [68, 151, 234];
    this.reset();
}


Gems.prototype.reset = function() {
    this.x = this.getRandom(this.x_pos);
    this.y = this.getRandom(this.y_pos);
    this.image = this.getRandom(this.sprite);
}

Gems.prototype.getRandom = function (thing) {
    return thing[Math.floor(Math.random() * thing.length)];
}

Gems.prototype.render = function() {
    if (game.currentState !== states.running) {
        return;
    }
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
}



var states = {
    running: 0,
    stopped: 1
}

var Game = function() {
    this.currentState = states.stopped;
    this.currentButton = "";
    this.startTime = 20;
    this.sounds = [
        new Audio("https://www.drodd.com/seinfeld-audio/upset.wav"),
        new Audio("https://www.drodd.com/seinfeld-audio/independent.mp3"),
        new Audio("https://www.drodd.com/seinfeld-audio/worlds.mp3"),
        new Audio("https://www.drodd.com/seinfeld-audio/sumrgrge.wav"),
        new Audio("https://www.drodd.com/seinfeld-audio/shame.mp3"),
        new Audio("http://www.televisiontunes.com/uploads/audio/Seinfeld.mp3"),
        new Audio("http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_coin.wav"),
        new Audio("http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_1-up.wav"),
        new Audio("http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_warning.wav"),
        new Audio("http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_powerup.wav"),
        new Audio("http://www.gamethemesongs.com/uploads/audio/Super%20Mario%20Kart%20-%20Star%20Power.mp3"),
        new Audio("http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_kick.wav")
    ];

    //Replay Seinfeld Theme when ended
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
    gem.reset();
    this.currentState = states.running;
    this.renderScore();
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
        //Pause Star Power Audio
        game.sounds[10].pause();
        //Play Seinfeld Theme from the beginning
        game.sounds[5].currentTime = 0;
        game.controlSounds(5);
        themePaused = false;
    }
    hit = false;
}


//Press Enter to activate Win/Lose buttons
$(document).keyup(function(event){
    if (game.currentState === states.stopped) {
        if(event.keyCode == 13){
            $(game.currentButton).click();
            event.preventDefault();
        }
    }
});

//Clicking the Win button
$("#win").click(function() {
    game.reset();
    $('#win').addClass('hidden')
});

//Clicking the Lose button
$("#lose").click(function() {
    game.reset();
    $('#lose').addClass('hidden')
    if (kills === 0 && game.currentState === states.running) {
        //Play Seinfeld Theme when new game is started
        game.sounds[5].currentTime = 0;
        game.sounds[5].volume = 0.25;
        game.controlSounds(5);
    }
});


//Clicking the Start Game button
$("#start-btn").click(function() {
    game.currentState = states.running;
    $('#start-game').addClass('hidden');
    game.sounds[5].play();
    game.sounds[5].volume = 0.25;
    game.reset();
});

//Press Enter to activate Start Game button
$(document).keyup(function(event){
    if (game.currentState === states.stopped) {
        if(event.keyCode == 13){
            $('#start-btn').click();
            event.preventDefault();
        }
    }
});


Game.prototype.showButton = function(button) {
    this.currentState = states.stopped;
    this.currentButton = button;
    $(this.currentButton).removeClass('hidden')
}


Game.prototype.updateScore = function() {
    if (win === true) {
        score = score + (level * 50) + timeNow;
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
            enemy.speedRange[1] = 300;
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
    if (gem.y === (player.y - 68) && hit === false) {
        if (gem.x >= player.x - 19 && gem.x <= player.x + 19) {
            if (gem.image === 'images/Star.png') {
                bonus = 100;
                invincible = true;
                //Play Power Up Audio
                game.controlSounds(9);
                player.sprite = 'images/george_hair_shine.png';
                //Play Star Power Audio
                game.sounds[10].currentTime = 38;
                game.sounds[10].volume = 0.5;
                game.controlSounds(10);
                //Pause Seinfeld Theme
                game.sounds[5].pause();
                themePaused = true;
            }
            else if (gem.image === 'images/Gem Green.png') {
                bonus = 50;
                game.controlSounds(6);
            }
            else if (gem.image === 'images/Gem Blue.png') {
                bonus = 20;
                game.controlSounds(6);
            }
            else if (gem.image === 'images/Heart.png') {
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
            //Make gem disappear
            gem.x = 600;
            this.renderScore();
        }
    }
    //Make Invincible George flash every 1 second
    if (player.sprite === 'images/george_hair_shine.png' && timeNow % 2 === 0) {
        player.sprite = 'images/george_hair.png';
    }
    else if (player.sprite === 'images/george_hair.png' && timeNow % 2 !== 0) {
        player.sprite = 'images/george_hair_shine.png';
    }
}


Game.prototype.updateTime = function() {
    if (countdown === true) {
        timer = setInterval(function(){myTimer()}, 1000);
        timeNow = this.startTime;
        function myTimer() {
            if (timeNow > 1) {
                timeNow -= 1;
                var timeText = timeNow.toString();
                $('.time-num').text(timeText);
                if (timeNow === 3) {
                    //Play Hurry Up Audio
                    game.controlSounds(8);
                }
            }
            else {
                game.killed();
                countdown = false;
                timeNow = this.startTime;
            }
        }
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
        //Play Shame Audio after George Divided Ends
        setTimeout(function(){ endDividedAudio() }, 4250);
        function endDividedAudio() {
            game.sounds[4].currentTime = 19.5;
            game.controlSounds(4);
        }
        //Play End Theme Audio after Shame Ends
        setTimeout(function(){ endShameAudio() }, 5750);
        function endShameAudio() {
            game.sounds[5].currentTime = 45.5;
            game.controlSounds(5);
        }
    }
}

Game.prototype.controlSounds = function(n) {
    if (muted === true) {
        return;
    }
    else {
        this.sounds[n].play();
    }
}

//Add Mute/Un-Mute button controls
$("#mute").click(function() {
    muted = true;
    $("#mute").addClass('hidden');
    $("#unmute").removeClass('hidden');
    //Pause Seinfeld Theme
    game.sounds[5].pause();
    //Pause Star Power Audio
    game.sounds[10].pause();
});

$("#unmute").click(function() {
    muted = false;
    $("#unmute").addClass('hidden');
    $("#mute").removeClass('hidden');
    if (invincible === true) {
        //Play Star Power Audio
        game.controlSounds(10);
    }
    else {
        //Play Seinfeld Theme
        game.sounds[5].play();
    }
});



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



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var frank = new Enemy();
var estelle = new Enemy();
var susan = new Enemy();
var allEnemies = [frank, estelle, susan];

var player = new Player();
var gem = new Gems();

var game = new Game();








//NEW CODE FOR CONTROLS (APRIL 10, 2019)
$('#up-btn').on('click', function() {
    if (game.currentState === states.running) {
        if (player.y > 100) {
            player.checkMove();
            if (moveUp === true) {
                player.y -= 83;
                moveLeft = true;
                moveRight = true;
                moveDown = true;
            }
        }
    }
});

$('#down-btn').on('click', function() {
    if (game.currentState === states.running) {
        if (player.y < 400) {
            player.checkMove();
            if (moveDown === true) {
                player.y += 83;
                moveLeft = true;
                moveRight = true;
                moveUp = true;
            }
        }
    }
});

$('#left-btn').on('click', function() {
    if (game.currentState === states.running) {
        if (player.x > 50) {
            player.checkMove();
            if (moveLeft === true) {
                player.x -= 100;
                moveRight = true;
                moveUp = true;
                moveDown = true;
            }
        }
    }
});

$('#right-btn').on('click', function() {
    if (game.currentState === states.running) {
        if (player.x < 400) {
            player.checkMove();
            if (moveRight === true) {
                player.x += 100;
                moveLeft = true;
                moveUp = true;
                moveDown = true;
            }
        }
    }
});