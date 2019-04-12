// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x_pos = [-150, 600];
    this.y_pos = [68, 151, 234];
    this.speed = Math.floor(Math.random() * 200 + 100);
    this.reset();
};


Enemy.prototype.reset = function() {
    var start_pos = this.x_pos[0];
    this.x = start_pos;
    this.y = this.getRandomY();
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var max_pos = this.x_pos[1];
    this.x += this.speed * dt;

    if (this.x > max_pos) {
        this.reset();
    }


};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.getRandomY = function () {
    return this.y_pos[Math.floor(Math.random() * this.y_pos.length)];
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x;
    this.y;
    this.reset();
}

Player.prototype.update = function() {
    if (this.y < 25) {
        alert("YOU WIN!!!");
        this.reset();
    }

    this.checkCollison();
}

Player.prototype.checkCollison = function() {
    var me = this;
    allEnemies.forEach(function(enemy) {
        if (enemy.y == me.y) {
            if (enemy.x >= player.x -30 && enemy.x <= player.x + 30) {
                me.reset();
            }
        }
    })
}

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > 0) {
        this.x -= 100;
    } else if (key === 'right' && this.x < 400) {
        this.x += 100;
    } else if (key === 'up' && this.y > 0) {
        this.y -= 83;
    } else if (key === 'down' && this.y < 400) {
        this.y += 83;
    }
}
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


var mew = new Enemy();
var nooge = new Enemy();
var snoogins = new Enemy();
var allEnemies = [mew, nooge, snoogins];

var player = new Player();