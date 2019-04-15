const state = {
    started: false,
    countdown: undefined,
    timer: undefined,
    timeNow: undefined,
    kills: 0,
    score: 0,
    level: 1,
    highScore: 0,
    killBonus: 0,
    win: false,
    muted: false,
    invincible: false,
    themePaused: false,
    hit: false,
    initiateStarPower: true,
    starInterval: undefined,
    running: 0,
    stopped: 1,
    moveLeft: true,
    moveRight: true,
    moveUp: true,
    moveDown: true
}

// Enemies our player must avoid
const Enemy = function() {
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
    if (game.currentState !== state.running) {
        return;
    }
    let max_pos = this.x_pos[1];
    this.x += this.speed * dt;

    if (this.x > max_pos) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};

Enemy.prototype.getRandom = function(item) {
    return item[Math.floor(Math.random() * item.length)];
}

Enemy.prototype.getRandomSpeed = function() {
    let minSpeed = this.speedRange[0];
    let maxSpeed = this.speedRange[1];
    return Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function() {
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
    if (game.currentState !== state.running) {
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
        state.win = true;
        //Reset timer
        clearInterval(state.timer);
        if (state.themePaused) {
            //Pause Star Power Audio
            game.sounds[10].pause();
            //Play Seinfeld Theme
            game.sounds[5].currentTime = 0;
            game.controlSounds(5);
            state.themePaused = false;
        }
        //End star power when player reaches the top
        if (state.invincible) {
            state.invincible = false;
            state.initiateStarPower = true;
            clearInterval(state.starInterval);
        }
    }
    this.checkCollison();
}

Player.prototype.checkCollison = function() {
    state.killBonus = 0;
    for (let i = 0; i < allEnemies.length; i++) {
        enemy = allEnemies[i];
        if (enemy.y === (player.y - 8)) {
            if (enemy.x >= player.x - 75 && enemy.x <= player.x + 75) {
                if(state.invincible) {
                    enemy.x = enemy.x_pos[1];
                    state.killBonus = 20;
                    state.score += state.killBonus;
                    game.renderScore();
                    //Play enemy kill audio
                    game.controlSounds(11);
                }
                else {
                    state.hit = true;
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

Player.prototype.handleInput = function(key) {
    if (game.currentState === state.running) {
        if (key === 'left' && this.x > 50) {
            this.checkForRock();
            if (state.moveLeft) {
                this.x -= 100;
                state.moveRight = true;
                state.moveUp = true;
                state.moveDown = true;
            }
        } else if (key === 'right' && this.x < 400) {
            this.checkForRock();
            if (state.moveRight) {
                this.x += 100;
                state.moveLeft = true;
                state.moveUp = true;
                state.moveDown = true;
            }
        } else if (key === 'up' && this.y > 100) {
            this.checkForRock();
            if (state.moveUp) {
                this.y -= 83;
                state.moveLeft = true;
                state.moveRight = true;
                state.moveDown = true;
            }
        } else if (key === 'down' && this.y < 400) {
            this.checkForRock();
            if (state.moveDown) {
                this.y += 83;
                state.moveLeft = true;
                state.moveRight = true;
                state.moveUp = true;
            }
        }
    }
}

Player.prototype.checkForRock = function() {
    if (gem.image === 'images/Rock.png') {
        if (gem.y === this.y - 68) {
            if (gem.x === this.x - 119) {
                state.moveLeft = false;
            }
            else if (gem.x === this.x + 81) {
                state.moveRight = false;
            }
        }
        else if (gem.x === this.x - 19){
            if (gem.y === this.y - 151) {
                state.moveUp = false;
            }
            else if (gem.y === this.y + 15) {
                state.moveDown = false;
            }
        }
    }
}

const Gems = function() {
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

Gems.prototype.getRandom = function (item) {
    return item[Math.floor(Math.random() * item.length)];
}

Gems.prototype.render = function() {
    if (game.currentState !== state.running) {
        return;
    }
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
}

const Game = function() {
    this.currentState = state.stopped;
    this.currentButton = '';
    this.startTime = 20;
    this.sounds = [
        new Audio('https://www.drodd.com/seinfeld-audio/upset.wav'),
        new Audio('https://www.drodd.com/seinfeld-audio/independent.mp3'),
        new Audio('https://www.drodd.com/seinfeld-audio/worlds.mp3'),
        new Audio('https://www.drodd.com/seinfeld-audio/sumrgrge.wav'),
        new Audio('https://www.drodd.com/seinfeld-audio/shame.mp3'),
        new Audio('http://www.televisiontunes.com/uploads/audio/Seinfeld.mp3'),
        new Audio('http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_coin.wav'),
        new Audio('http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_1-up.wav'),
        new Audio('http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_warning.wav'),
        new Audio('http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_powerup.wav'),
        new Audio('http://www.gamethemesongs.com/uploads/audio/Super%20Mario%20Kart%20-%20Star%20Power.mp3'),
        new Audio('http://www.mariomayhem.com/downloads/sounds/super_mario_bros/smb_kick.wav')
    ];
    //Replay Seinfeld Theme when ended
    this.sounds[5].addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    this.sounds[5].play();
}

Game.prototype.reset = function() {
    state.countdown = true;
    player.reset();
    allEnemies.forEach(function(enemy) {
        enemy.reset();
    })
    gem.reset();
    this.currentState = state.running;
    this.renderScore();
    this.updateTime();
    if (state.kills === 0) {
        $('#heart3').removeClass('hidden');
        $('#heart2').removeClass('hidden');
        $('#heart1').removeClass('hidden');
        $('#first-kill').removeClass('hidden');
    }
    let timeText = this.startTime.toString();
    $('.time-num').text(timeText);
    if (state.invincible) {
        state.invincible = false;
        state.initiateStarPower = true;
    }
    if (state.themePaused) {
        //Pause Star Power Audio
        game.sounds[10].pause();
        //Play Seinfeld Theme from the beginning
        game.sounds[5].currentTime = 0;
        game.controlSounds(5);
        state.themePaused = false;
    }
    state.hit = false;
}

Game.prototype.showButton = function(button) {
    this.currentState = state.stopped;
    this.currentButton = button;
    $(this.currentButton).removeClass('hidden')
}

Game.prototype.updateScore = function() {
    if (state.win) {
        state.score = state.score + (state.level * 50) + state.timeNow;
        state.level += 1;
        state.win = false;
        allEnemies.forEach(function(enemy) {
            enemy.speedRange[0] = (enemy.speedRange[0] + 20);
            enemy.speedRange[1] = (enemy.speedRange[1] + 30);
        })
    }
    if (state.kills > 2) {
        if (state.score > state.highScore) {
            state.highScore = state.score;
        }
        state.score = 0;
        state.level = 1;
        state.kills = 0;
        allEnemies.forEach(function(enemy) {
            enemy.speedRange[0] = 50;
            enemy.speedRange[1] = 300;
        })
    }
}

Game.prototype.renderScore = function() {
    this.updateScore();
    let scoreText = state.score.toString();
    $('.score-num').text(scoreText);
    let levelText = state.level.toString();
    $('.level-num').text(levelText);
    let highScoreText = state.highScore.toString();
    $('.high-score-num').text(highScoreText);
}

Game.prototype.update = function() {
    let bonus = 0;
    if (gem.y === (player.y - 68) && !state.hit) {
        if (gem.x >= player.x - 19 && gem.x <= player.x + 19) {
            if (gem.image === 'images/Star.png') {
                bonus = 100;
                state.invincible = true;
                //Play Power Up Audio
                game.controlSounds(9);
                player.sprite = 'images/george_hair_glow.png';
                //Play Star Power Audio
                game.sounds[10].currentTime = 38;
                game.sounds[10].volume = 0.5;
                game.controlSounds(10);
                //Pause Seinfeld Theme
                game.sounds[5].pause();
                state.themePaused = true;
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
                if (state.kills === 0) {
                    bonus = 200;
                    game.controlSounds(6);
                }
                else if (state.kills === 1) {
                    $('#heart3').removeClass('hidden');
                    state.kills = 0;
                    game.controlSounds(7);
                }
                else if (state.kills === 2) {
                    $('#heart2').removeClass('hidden');
                    state.kills = 1;
                    game.controlSounds(7);
                }
            }
            state.score += bonus;
            //Make gem disappear
            gem.x = 600;
            this.renderScore();
        }
    }
    //Make Invincible George flash
    if (state.initiateStarPower && state.invincible) {
        state.initiateStarPower = false;
        state.starInterval = window.setInterval(switchImage, 300);
        function switchImage() {
            if (player.sprite === 'images/george_hair_glow.png') {
                player.sprite = 'images/george_hair.png';
            }
            else if (player.sprite === 'images/george_hair.png') {
                player.sprite = 'images/george_hair_glow.png';
            }
        }
    }
}

Game.prototype.updateTime = function() {
    if (state.countdown) {
        state.timer = setInterval(function(){myTimer()}, 1000);
        state.timeNow = this.startTime;
        function myTimer() {
            if (state.timeNow > 1) {
                state.timeNow -= 1;
                let timeText = state.timeNow.toString();
                $('.time-num').text(timeText);
                if (state.timeNow === 3) {
                    //Play Hurry Up Audio
                    game.controlSounds(8);
                }
            }
            else {
                game.killed();
                state.countdown = false;
                state.timeNow = this.startTime;
            }
        }
    }
}

Game.prototype.killed = function() {
    clearInterval(state.timer);
    clearInterval(state.starInterval);
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
    })
    player.sprite = 'images/costanza_scared.png';
    game.showButton('#lose');
    state.kills += 1;
    if (state.kills === 1) {
        $('#heart3').addClass('hidden');
        $('#second-kill').addClass('hidden');
        $('#third-kill').addClass('hidden');
        //Play George Upset Audio
        game.controlSounds(0);
    }
    else if (state.kills === 2) {
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
    if (state.muted === true) {
        return;
    }
    else {
        this.sounds[n].play();
    }
}

//Clicking the Start Game button
$('#start-btn').click(function() {
    game.currentState = state.running;
    $('#start-game').addClass('hidden');
    game.sounds[5].play();
    game.sounds[5].volume = 0.25;
    game.reset();
});

//Clicking the Win button
$('#win-btn').click(function() {
    game.reset();
    $('#win').addClass('hidden')
});

//Clicking the Lose button
$('#lose').click(function() {
    game.reset();
    $('#lose').addClass('hidden')
    if (state.kills === 0 && game.currentState === state.running) {
        //Play Seinfeld Theme when new game is started
        game.sounds[5].currentTime = 0;
        game.sounds[5].volume = 0.25;
        game.controlSounds(5);
    }
});

$(document).keyup(function(event){
    if(event.keyCode === 13){
        //Press Enter to activate Start Game button
        if (!state.started) {
            $('#start-btn').click();
            event.preventDefault();
            state.started = true;
        }
        //Press Enter to activate Win/Lose buttons
        else if (game.currentState === state.stopped) {
            $(game.currentButton + '-btn').click();
            event.preventDefault();
        }
    }
});

//Add Mute/Un-Mute button controls
$('#mute').click(function() {
    state.muted = true;
    $('#mute').addClass('hidden');
    $('#unmute').removeClass('hidden');
    //Pause Star Power Audio
    if (state.invincible) {
        game.sounds[10].pause();
    } else {
        //Pause Seinfeld Theme
        game.sounds[5].pause();
    }
});

$('#unmute').click(function() {
    state.muted = false;
    $('#unmute').addClass('hidden');
    $('#mute').removeClass('hidden');
    if (state.invincible) {
        //Play Star Power Audio
        game.controlSounds(10);
    }
    else {
        //Play Seinfeld Theme
        game.sounds[5].play();
    }
});

$('#up-btn').click(function() {
    if (game.currentState === state.running) {
        if (player.y > 100) {
            player.checkForRock();
            if (state.moveUp) {
                player.y -= 83;
                state.moveLeft = true;
                state.moveRight = true;
                state.moveDown = true;
            }
        }
    }
});

$('#down-btn').click(function() {
    if (game.currentState === state.running) {
        if (player.y < 400) {
            player.checkForRock();
            if (state.moveDown) {
                player.y += 83;
                state.moveLeft = true;
                state.moveRight = true;
                state.moveUp = true;
            }
        }
    }
});

$('#left-btn').click(function() {
    if (game.currentState === state.running) {
        if (player.x > 50) {
            player.checkForRock();
            if (state.moveLeft) {
                player.x -= 100;
                state.moveRight = true;
                state.moveUp = true;
                state.moveDown = true;
            }
        }
    }
});

$('#right-btn').click(function() {
    if (game.currentState === state.running) {
        if (player.x < 400) {
            player.checkForRock();
            if (state.moveRight) {
                player.x += 100;
                state.moveLeft = true;
                state.moveUp = true;
                state.moveDown = true;
            }
        }
    }
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
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
const frank = new Enemy();
const estelle = new Enemy();
const susan = new Enemy();
const allEnemies = [frank, estelle, susan];
const player = new Player();
const gem = new Gems();
const game = new Game();