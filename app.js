let canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];
let canvas = document.getElementById('playground');
let ctx = canvas.getContext('2d');
let startTime;
let note = document.getElementById('note');
let button = document.getElementById('button');
let pointsWrapper = document.getElementsByClassName('points-wrapper')[0];
let count = 0;
let delayNumber = 250;

let badgeElement = document.getElementById('badge');
let badgesElement = document.getElementById('badges');
let streak = document.getElementById('streak');
let highestStreak = document.getElementById('high');
let badge = '';
let badges = [];
let streakCounts = [];

function assignBadge(badgeName) {
    badge = badgeName;
    if(!badges.includes(badgeName)) {
        badges.push(badge);
    }
    badgeElement.innerHTML = `Badge Earned: <strong>${badge}</strong>`;
}

function getTransform() {
    let x = window.innerWidth;
    let y = window.innerHeight;
    if(x >= 300 && x <= 767) {
        x /= 2;
        y /= 2;
    } else if(x > 768 && x <= 1920) {
        x /= 1.25;
        y /= 4;
    } else {
        x /= 1.75;
        y /= 3.5;
    }
    let transform = `translate(${randomNumber(x)}px, ${randomNumber(y)}px)`;
    return transform;
}

function start() {
    const date = new Date();
    startTime = date.getTime();
}

function randomColor() {
    let color = `rgb(${Math.floor(100 * Math.random())},
        ${Math.floor(100 * Math.random())},
        ${Math.floor(100 * Math.random())})`
    return color;
}

function randomNumber(limit) {
    const n = Math.floor(Math.random() * limit);
    return n;
}

function drawRectangle() {
    ctx.fillStyle = randomColor();
    ctx.fillRect(50, 50, 200, 150);
}

function drawSquare() {
    ctx.fillStyle = randomColor();
    ctx.fillRect(50, 50, 100, 100);
}

function drawCircle() {
    ctx.fillStyle = randomColor();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(50, 100, 50, 0, 2* Math.PI);
    ctx.stroke();
    ctx.fill();
}

function dateDifference() {
    const date = new Date();
    const endTime = date.getTime();
    let d = Math.abs(startTime - endTime) / 1000;
    return d;
}


function drawFigure() {
    const number = Math.floor(Math.random() * 3);
    canvas.width = canvas.width;
    start();
    if(number === 0) {
        drawRectangle();
    } else if(number === 1) {
        drawCircle();
    } else {
        drawSquare();
    }
}

// logic to set difficulty for various device widths
function alterTime(t) {
    let w = window.innerWidth;
    if(w >= 300 && w <= 767) {
        t += 0.1;
    } else if(w >=768 && w<= 1920) {
        t += 0.05;
    }
    return t.toFixed(2);
}


function gameLogic() {
    canvas.width = canvas.width;
    canvas.style.transform = getTransform();

    let delay = Math.floor(delayNumber * (Math.random() * 2));
    let r = dateDifference();
    r = alterTime(r);

    let p = document.getElementById('reaction');
    p.innerHTML = `${r}s`;


    if(r < 1) {
        highestStreak.style.display = 'none';
        streak.innerHTML = count;
        count++;
    } else {
        highestStreak.style.display = 'block';
        streakCounts.push(count);
        count = 0;
        endGame();
    }


    if(badges.length > 1) {
        badgeElement.innerHTML = `Last Badge Earned: <strong>${badge}</strong>`;
        badgesElement.innerHTML =  `Badges earned: <strong>${badges.join(
            ' , '
        )}</strong>`
    }

    switch(count) {
        case 0:
            if(badges.length === 0) {
                // do nothing
            } else {
                badgeElement.innerHTML = `Last Badge Earned: <strong>${
                    badges[badges.length - 1]
                }</strong>`;
                badgesElement.innerHTML = `Badges earned: <strong>${badges.join(
                    ' , '
                )}</strong>`
            } 
            break;
        case 10:
            assignBadge('Starter');
            break;
        case 25:
            assignBadge('Sharp');
            break;
        case 50:
            assignBadge('Champion');
            break;
        case 100:
            assignBadge('Expert');
            break;
        case 250:
            assignBadge('Legend');
        case 500:
            assignBadge('Flash');
            endGame();
            break;
    }

    if(count >= 1 && count <= 25) {
        note.innerHTML = 
            'Keep up the pace.<br/> Your reaction speed could be better! 😃';
    } else if(count > 25 && count <= 50) {
        delayNumber = 500;
        note.innerHTML = 
            `Your reaction speed is Awesome! Concentrate and don't give up! 😉`;
    } else if (count > 50 && count <= 100) {
        delayNumber = 750;
        note.innerHTML = 'Amazing reaction speed!! 😎';
    } else if (count > 100 && count <= 250) {
        delayNumber = 1000
        note.innerHTML = 'You are the champ!! <br/> Keep going! 😂'
    } else if (count > 250 && count <= 500) {
        delayNumber = 1250
        note.innerHTML =
        'You are the Legend!! <br/> Very close to earning a Flash badge!! 😉'
    } else if (count > 500) {
        note.innerHTML = 'You are the Flash! Relax now, Game is over!!! 😂'
    } else {
        note.innerHTML =
        'Oops, you have taken more than a second to react! <br/> Focus and play the game again! 😞'
    }

    if(r > 5) {
        note.innerHTML = 
        'Poor reaction speed! <br/> Take a break and start again 😥.'
    }

    if(window.innerWidth > 575) {
        setTimeout(drawFigure, delay);
    } else {
        drawFigure();
    }
}


function startGame() {
    canvasWrapper.style.display = 'block';
    canvas.width = canvas.width;
    canvas.style.transform = getTransform();
    drawCircle();
    start();
    button.style.display = 'none';
    pointsWrapper.style.display = 'grid';
    note.innerHTML = 
        'You will get some inspiring status quotes once you start the game!'
    canvas.addEventListener('click', gameLogic);
    canvas.addEventListener('touchstart', gameLogic);
}

function endGame() {
    canvasWrapper.style.display = 'none';
    button.style.display = 'block';
    button.innerHTML = 'Restart Game';
    canvas.removeEventListener('click', gameLogic);
    canvas.removeEventListener('touchstart', gameLogic);
    streak.innerHTML = streakCounts[streakCounts.length - 1];
    highestStreak.innerHTML =   `Highest Streak: <strong>${Math.max(...streakCounts)}</strong>`;
}

pointsWrapper.style.display = 'none';