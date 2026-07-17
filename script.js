const scoreVal = document.getElementById('scoreVal');
const startScreen = document.getElementById('startScreen');
const gameArea = document.getElementById('gameArea');

let player = { speed: 5, score: 0 };
let keys = { ArrowLeft: false, ArrowRight: false };

const enemyColors = ['blue', 'green', 'white', 'purple', 'yellow', 'grey'];

// --- BACHON KI APNI LOCAL IMAGES (bina internet ke bhi chalengi!) ---
const bacha1_img = "bacha1.jpg.jpg"; // Left side bacha (Yellow Shirt)
const bacha2_img = "bacha2.jpg.jpg"; // Right side bacha (Blue Shirt)

// --- CARTOON AVATARS FOR CARS ---
const cartoonDriver1 = "https://api.dicebear.com/7.x/bottts/svg?seed=player1"; // Player cartoon
const cartoonDriver2 = "https://api.dicebear.com/7.x/bottts/svg?seed=enemy1";  // Enemy cartoon

// Side panels me images set karein
document.getElementById('leftKid').style.backgroundImage = `url('${bacha1_img}')`;
document.getElementById('rightKid').style.backgroundImage = `url('${bacha2_img}')`;

document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

startScreen.addEventListener('click', startGame);

function addWheels(carElement) {
    const positions = ['front-left', 'front-right', 'back-left', 'back-right'];
    positions.forEach(pos => {
        let wheel = document.createElement('div');
        wheel.setAttribute('class', `wheel w-${pos}`);
        carElement.appendChild(wheel);
    });
}

function addDriver(carElement, imagePath) {
    let driver = document.createElement('div');
    driver.setAttribute('class', 'driver');
    driver.style.backgroundImage = `url('${imagePath}')`;
    carElement.appendChild(driver);
}

function startGame() {
    startScreen.style.display = 'none';
    gameArea.innerHTML = ''; 
    player.start = true;
    player.score = 0;
    scoreVal.innerText = player.score;

    // Road lines
    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        roadLine.y = x * 150;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    // Player Sports Car with Cartoon Driver
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    addWheels(car);
    addDriver(car, bacha1_img); 
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // 3 Enemy Sports Cars with Cartoon Driver
    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        
        let randomColor = enemyColors[Math.floor(Math.random() * enemyColors.length)];
        enemyCar.setAttribute('class', `enemy ${randomColor}`);
        
        addWheels(enemyCar);
        addDriver(enemyCar, bacha2_img); 
        
        enemyCar.y = ((x + 1) * 350) * -1; 
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * 300) + "px"; 
        gameArea.appendChild(enemyCar);
    }

    window.requestAnimationFrame(gamePlay);
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach((item) => {
        if (item.y >= 750) {
            item.y -= 800;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((item) => {
        if (isCollide(car, item)) {
            endGame();
        }

        if (item.y >= 800) {
            item.y = -350; 
            item.style.left = Math.floor(Math.random() * 300) + "px";
            
            item.className = 'enemy'; 
            let randomColor = enemyColors[Math.floor(Math.random() * enemyColors.length)];
            item.classList.add(randomColor);
            
            addWheels(item);
            addDriver(item, cartoonDriver2); 
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function gamePlay() {
    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemy(car);

        if (keys.ArrowLeft && player.x > 10) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < (road.width - 68)) {
            player.x += player.speed;
        }

        car.style.left = player.x + "px";

        player.score++;
        scoreVal.innerText = player.score;

        if (player.score % 500 === 0) {
            player.speed += 1;
        }

        window.requestAnimationFrame(gamePlay);
    }
}

function endGame() {
    player.start = false;
    startScreen.style.display = 'block';
    startScreen.innerHTML = `
        <h1>Game Over!</h1>
        <p>Aapka Score: <strong>${player.score}</strong></p>
        <p>Dobara khelne ke liye yahan click karein!</p>
    `;
    player.speed = 5; 
}