const node = 20; //游戏中一格的大小
const gameBox = 400; //游戏框的大小
const rows = gameBox / node; //行数和列数
let time = 200;//主循环的时间间隔

let game = document.getElementById("game"), //游戏框
    start = document.getElementById("start"); //开始按钮


let snake = new Event(),
    dot = new Event(),
    score = new Event();

score.oldScore = localStorage.getItem('score') || 0;
let highestScore = document.getElementById("highestScore");
highestScore.innerHTML = "Highest Score: " + score.oldScore;

snake.on('init', function () {
    this.sBody = [];
    this.dir = 38;
    for (let i = 0; i < 5; i++) {
        game.innerHTML += "<div class='sBody'></div>";
        this.sBody[i] = {
            x: 0,
            y: 14 + i
        };
        this.dir = 38;
        this.newDir = 38;
    }
    window.addEventListener('keydown', function (e) { //绑定window的keydown事件
        snake.emit('changeDir', e.keyCode);
    });
    dot.emit('init');
});

snake.on('changeDir', function (key) {
    if (key < 37 || key > 40) {
        return;
    }
    if (key != this.dir + 2 && key != this.dir - 2) {
        this.dir = key;
    }
});

dot.on('init', function () {
    game.innerHTML += "<div class='dot'></div>";
    this.x = Math.round(Math.random() * 15 + 4);
    this.y = Math.round(Math.random() * 15 + 4);
    window.setTimeout(function () {
        snake.emit('move');
    }, time);
});

snake.on('move', function () {
    for (let i = this.sBody.length - 1; i > 0; i--) {
        this.sBody[i].x = this.sBody[i - 1].x;
        this.sBody[i].y = this.sBody[i - 1].y;
    }
    switch (this.dir) {
        case 37:
            this.sBody[0].x--;
            break;
        case 38:
            this.sBody[0].y--;
            break;
        case 39:
            this.sBody[0].x++;
            break;
        case 40:
            this.sBody[0].y++;
            break;
        default:
            break;
    }
    snake.emit('judge');
});

snake.on('judge', function () {
    function judge(x, y) { //判断蛇身是否重合
        for (var i = 1; i < snake.sBody.length; i++) {
            if (snake.sBody[i].x == x && snake.sBody[i].y == y) {
                return false;
            }
        }
        return true;
    }

    if (this.sBody[0].x < 0 || this.sBody[0].x >= rows || this.sBody[0].y < 0 || this.sBody[0].y >= rows) { //判断蛇身是否超出框外
        snake.emit('gameOver');
        return;
    }
    if (!judge(this.sBody[0].x, this.sBody[0].y)) { //判断蛇身是否重合
        snake.emit('gameOver');
        return;
    }
    dot.emit('move');
});

dot.on('move', function () {
    function judge(x, y) { //判断新的点是否和蛇身重合
        for (var i = 0; i < snake.sBody.length; i++) {
            if (snake.sBody[i].x == x && snake.sBody[i].y == y) {
                return false;
            }
        }
        return true;
    }

    if (snake.sBody[0].x == dot.x && snake.sBody[0].y == dot.y) { //蛇的头与点的位置重合，说明吃到了点，需要更新点的位置
        this.x = Math.round(Math.random() * 19);
        this.y = Math.round(Math.random() * 19);
        while (!judge(this.x, this.y)) {
            this.x = Math.round(Math.random() * 19);
            this.y = Math.round(Math.random() * 19);
        }
        snake.emit('addLength');
    }
    snake.emit('continue');
});

snake.on('addLength', function () {
    game.innerHTML += "<div class='sBody'></div>";
    this.sBody.push({});
});

snake.on('gameOver', function () {
    game.innerHTML += "<div class='result'>Game Over</div>";
    start.disabled = false;
    score.emit('setNewScore', snake.sBody.length - 5);
});

score.on('setNewScore', function (result) {
    if (this.oldScore < result) {
        this.oldScore = result;
        localStorage.removeItem("score");
        localStorage.setItem("score", result);
        highestScore.innerHTML = "Highest Score: " + result;
    }
});

snake.on('continue', function () {
    (function show() { // 刷新视图
        let sBody = game.getElementsByClassName("sBody"), //蛇身
            dotNode = game.getElementsByClassName("dot")[0], //点
            scoreEle = document.getElementById("score"); //成绩

        for (let i = 0; i < sBody.length; i++) {
            sBody[i].style.left = snake.sBody[i].x * node + "px";
            sBody[i].style.top = snake.sBody[i].y * node + "px";
        }
        dotNode.style.left = dot.x * node + "px";
        dotNode.style.top = dot.y * node + "px";

        scoreEle.innerHTML = "Score : " + (snake.sBody.length - 5);
    })();

    time = 200 - (snake.sBody.length - 5) * 5;
    window.setTimeout(function () {
        snake.emit('move');
    }, time)
});

start.addEventListener('click', function () {
    start.disabled = true;
    game.innerHTML = '';
    snake.emit('init');
});
