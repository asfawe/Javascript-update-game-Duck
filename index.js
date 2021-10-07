const score = document.querySelector(".score");
const startBtn = document.querySelector(".startBtn");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

startBtn.addEventListener("click", start);
gameMessage.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
let keys = {};
let player = {
    x:0,
    y:0,
    speed:2,
    score:0,
    inplay: false
};
let pipe = {
    startPos : 0,
    spaceBetweenRow : 0,
    spaceBetweenCol : 0,
    pipeCount : 0
};

function start() {
    console.log("game start");
    player.inplay = true;
    player.score = 0;
    gameArea.innerHTML = ""; // gameArea에 있는 요소들을 싹다 없애준다.
    gameMessage.classList.add("hide");
    startBtn.classList.add("hide");
    let bird = document.createElement("div"); // createElement는 html요소를 생성해줄수 있는 함수이다.
    let wing = document.createElement("div");
    bird.setAttribute("class", "bird");
    wing.setAttribute("class", "wing");
    wing.pos = 15;
    wing.style.top = wing.pos + "px";
    bird.appendChild(wing); // bird에 자식으로 붙게 한다.
    gameArea.appendChild(bird);
    player.x = bird.offsetLeft; // bird.offsetLeft는 bird의 left값을 갔는다.
    player.y = bird.offsetTop;

    pipe.startPos = 0;
    pipe.spaceBetweenRow = 400;
    pipe.pipeCount = Math.floor(gameArea.offsetWidth / pipe.spaceBetweenRow) //Math.floor는 소수여도 정수로 반환을 한다. pipeCount는 화면의 크기에 따라 갯수를 정해주는 것이다.

    for(let i = 0; i < pipe.pipeCount; i++){
        makePipe(pipe.startPos * pipe.spaceBetweenRow);
        pipe.startPos++;
    }
    window.requestAnimationFrame(playGame); // 움직일 함수를 requestAnimationFrame()의 매개변수로 집어넣어준다. 그러면 웹 사이트에서 이런 함수로 웹 페이지를 제어 할거구나 라는 걸 미리 알려줘서 더 부드럽게 움직일수 있게 하는거다.
}

function makePipe(pipePos) {
    let totalHeight = gameArea.offsetHeight;
    let totalWidth = gameArea.offsetWidth;
    let pipeUp = document.createElement("div");
    pipeUp.classList.add("pipe");
    pipeUp.height = Math.floor(Math.random() * 350);
    pipeUp.style.height = pipeUp.height + "px";
    pipeUp.style.left = totalWidth + pipePos + "px";
    pipeUp.x = totalWidth + pipePos;
    pipeUp.style.top = "0px";
    pipeUp.style.backgroundColor = "red";
    gameArea.appendChild(pipeUp);

    pipe.spaceBetweenCol = Math.floor(Math.random() * 250) + 150 //아래쪽 파이프하고 위쪽 파이프에 최소,최고 간격을 정해준다.

    let pipeDown = document.createElement("div");
    pipeDown.classList.add("pipe");
    pipeDown.style.height = totalHeight - pipeUp.height - pipe.spaceBetweenCol + "px";
    pipeDown.style.left = totalWidth + pipePos + "px";
    pipeDown.x = totalWidth + pipePos;
    pipeDown.style.bottom = "0px";
    pipeDown.style.backgroundColor = "black";
    gameArea.appendChild(pipeDown);
}

function movePipes(bird) {
    let pipes = document.querySelectorAll(".pipe");
    let counter = 0;
    pipes.forEach(function(item){
        item.x -= player.speed;
        item.style.left = item.x + "px";
        if(keys.ArrowRight){
            item.x -= (player.speed+1) * 2;
            item.style.left = item.x + "px";
        }
        if(keys.ArrowLeft){
            item.x += player.speed * 2;
            item.style.left = item.x + "px";
        }
        if(item.x < -100) {
            item.parentElement.removeChild(item); // item에 부모까지 갈수 있도록 하는게 parentElement다. 그런다음 삭제를 한다. item. 곳 파이프를 삭제한다.
            counter++;
        }

        if(isCollide(item, bird)){
            playGameOver(bird);
        }
    });

    for(let i = 0; i < counter/2; i++){
        makePipe(0);
    }
}

function isCollide(pipe, bird) {
    let pipeRect = pipe.getBoundingClientRect();
    let birdRect = bird.getBoundingClientRect();
    return(
        pipeRect.bottom > birdRect.top &&
        pipeRect.top < birdRect.bottom &&
        pipeRect.left < birdRect.right &&
        pipeRect.right > birdRect.left
    )
}

function playGame() { // game을 자연스럽게 실행하는 부분입니다.
    if(player.inplay){
        let bird = document.querySelector(".bird");
        let wing = document.querySelector(".wing");
        movePipes(bird);
        let move = false;
        if(keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
            move = true;
        }
        if(keys.ArrowRight && player.x < gameArea.offsetWidth - bird.offsetWidth){
            player.x += player.speed;
            move = true;
        }
        if((keys.ArrowUp || keys.Space) && player.y > 0) {
            player.y -= player.speed * 5;
            move = true;
        }
        if(keys.ArrowDown && player.y < gameArea.offsetHeight - bird.offsetHeight){
            player.y += player.speed;
            move = true;
        }

        if(move){
            wing.pos = wing.pos === 15 ? 25 : 15; // 만약 wing.pos가 15라면 25를 넣어주고 아니면 15를 넣어준다.
            wing.style.top = wing.pos + "px";
        }

        player.y += player.speed * 2;
        if(player.y > gameArea.offsetHeight - bird.offsetHeight){
            console.log("game over");
            playGameOver(bird);
        }
        bird.style.left = player.x + "px"; // bird의 left를 바꿀건데 player.x 만큼. style에 등록할거기 때문에 "px"은 무조건 적어주셔야 합니다.
        bird.style.top = player.y + "px"; 
        window.requestAnimationFrame(playGame);
        player.score ++;
        score.innerText = "SCORE : " + player.score;
    }
    
}

function playGameOver(bird) {
    player.inplay = false;
    gameMessage.classList.remove("hide");
    gameMessage.innerHTML = 
    "GAME OVER<br/>당신의 점수는 "+
    (player.score + 1) + 
    "점 입니다. <br/> 다시 시작하려면 여기를 누르세요.";
    bird.setAttribute("style", "transform:rotate(180deg)"); // transform 어떤요소에 방향이나 위치나 어떤 형태등을 변경할때 사용할수 있다.
}

function pressOn(e){
    console.log(e.code);
    keys[e.code] = true; // keys라는 객체 에다가 추가를 해주는 모습
    console.log(keys);
}

function pressOff(e) {
    console.log(e.code);
    keys[e.code] = false;
    console.log(keys);

}   