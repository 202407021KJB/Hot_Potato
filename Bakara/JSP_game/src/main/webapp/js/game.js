console.log("game.js 로드됨 ✅");

// --- DOM 요소 가져오기 ---
const startBtn = document.getElementById("startBtn");
const canvas = document.getElementById("ladderCanvas");
const ctx = canvas.getContext("2d");
const playerInputsContainer = document.getElementById("player-inputs");
const resultOutputsContainer = document.getElementById("result-outputs");

// --- 전역 변수 ---
const LADDER_TOP = 50;
const LADDER_BOTTOM = canvas.height - 50;
const LADDER_LEFT = 50;
const LADDER_RIGHT = canvas.width - 50;

let ladderData = null;
let isAnimating = false;
let numPlayers = 2; // 2명으로 고정

// --- 초기화 및 설정 ---

function initializeGame() {
    // URL 파싱 로직 삭제
    // 입력 상자 생성 및 캔버스 초기화
    createInputBoxes(numPlayers);
    clearCanvas();
}

function createInputBoxes(count) {
    playerInputsContainer.innerHTML = '';
    resultOutputsContainer.innerHTML = '';

    // 참가자 1 (왼쪽)
    const player1Div = document.createElement('div');
    player1Div.className = 'player-box';
    player1Div.innerHTML = `<input type="text" value="좌" readonly>`;
    playerInputsContainer.appendChild(player1Div);

    // 참가자 2 (오른쪽)
    const player2Div = document.createElement('div');
    player2Div.className = 'player-box';
        player2Div.innerHTML = `<input type="text" value="우" readonly>`;
    playerInputsContainer.appendChild(player2Div);

    // 결과 1 (당첨)
    const result1Div = document.createElement('div');
    result1Div.className = 'result-box';
    result1Div.innerHTML = `<input type="text" value="당첨" readonly>`;
    resultOutputsContainer.appendChild(result1Div);

    // 결과 2 (꽝)
    const result2Div = document.createElement('div');
    result2Div.className = 'result-box';
    result2Div.innerHTML = `<input type="text" value="꽝" readonly>`;
    resultOutputsContainer.appendChild(result2Div);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- 사다리 데이터 생성 및 그리기 ---

function generateLadderData(count) {
    if (count < 2) return null;
    const stepX = (LADDER_RIGHT - LADDER_LEFT) / (count - 1);
    const xPositions = Array.from({ length: count }, (_, i) => LADDER_LEFT + i * stepX);
    const rungs = [];
    const yStep = 28;

    for (let y = LADDER_TOP + 20; y < LADDER_BOTTOM - 20; y += yStep) {
        const placedInLevel = [];
        for (let i = 0; i < count - 1; i++) {
            if (placedInLevel.includes(i)) continue;
            if (Math.random() > 0.5) {
                rungs.push({ y, col: i });
                placedInLevel.push(i, i + 1);
            }
        }
    }
    return { xPositions, rungs };
}

function drawLadder(data) {
    clearCanvas();
    if (!data) return;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    data.xPositions.forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, LADDER_TOP);
        ctx.lineTo(x, LADDER_BOTTOM);
        ctx.stroke();
    });

    data.rungs.forEach(({ y, col }) => {
        const x1 = data.xPositions[col];
        const x2 = data.xPositions[col + 1];
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
    });
}

// --- 경로 탐색 및 애니메이션 ---

function findPath(startCol) {
    const { xPositions, rungs } = ladderData;
    const path = [];
    let currentCol = startCol;
    let currentY = LADDER_TOP;

    path.push([xPositions[currentCol], currentY]);

    const yLevels = [...new Set(rungs.map(r => r.y))].sort((a, b) => a - b);

    for (const levelY of yLevels) {
        path.push([xPositions[currentCol], levelY]);
        const rungToCross = rungs.find(r => r.y === levelY && (r.col === currentCol || r.col === currentCol - 1));
        if (rungToCross) {
            if (rungToCross.col === currentCol) {
                currentCol++;
            } else {
                currentCol--;
            }
            path.push([xPositions[currentCol], levelY]);
        }
    }

    path.push([xPositions[currentCol], LADDER_BOTTOM]);
    return { path, endCol: currentCol };
}

function animatePath(result) {
    isAnimating = true;
    const { path, endCol } = result;
    let currentPoint = 0;
    let currentX = path[0][0];
    let currentY = path[0][1];
        const speed = 15;

    const resultBoxes = resultOutputsContainer.querySelectorAll('.result-box input');
    resultBoxes.forEach(box => {
        box.style.backgroundColor = '';
        box.style.fontWeight = 'normal';
    });

    function animate() {
        if (currentPoint >= path.length - 1) {
            isAnimating = false;
            resultBoxes[endCol].style.backgroundColor = 'gold';
            resultBoxes[endCol].style.fontWeight = 'bold';
            drawLadder(ladderData);
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 3;
            for (let i = 0; i < path.length; i++) {
                ctx.lineTo(path[i][0], path[i][1]);
            }
            ctx.stroke();
            return;
        }

        drawLadder(ladderData);

        const targetX = path[currentPoint + 1][0];
        const targetY = path[currentPoint + 1][1];

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        for (let i = 0; i <= currentPoint; i++) {
            ctx.lineTo(path[i][0], path[i][1]);
        }
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        if (currentY < targetY) currentY = Math.min(currentY + speed, targetY);
        if (currentX < targetX) currentX = Math.min(currentX + speed, targetX);
        if (currentX > targetX) currentX = Math.max(currentX - speed, targetX);

        if (currentX === targetX && currentY === targetY) {
            currentPoint++;
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// --- 이벤트 리스너 ---

startBtn.addEventListener("click", function () {
    if(isAnimating) return;
    if (numPlayers === 0) {
        alert("참가 인원을 설정할 수 없습니다.");
        return;
    }

    // 서버에서 사다리 데이터 가져오기
    const contextPath = document.getElementById('game-container').dataset.contextPath;
    fetch(`${contextPath}/ladder?players=${numPlayers}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('서버와 통신하여 사다리 데이터를 가져오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            ladderData = data;
            drawLadder(ladderData);
            console.log(`${numPlayers}명으로 서버에서 사다리 생성 완료`, ladderData);
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
        });
});

canvas.addEventListener("click", function (e) {
    if (!ladderData || isAnimating) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y > LADDER_TOP - 20 && y < LADDER_TOP + 20) {
        const { xPositions } = ladderData;
        for (let i = 0; i < xPositions.length; i++) {
            if (Math.abs(x - xPositions[i]) < 15) {
                const result = findPath(i);
                // 디버그 로그 추가
                const finalResultInput = resultOutputsContainer.children[result.endCol].querySelector('input');
                console.log(`--- 사다리 디버그 로그 ---`);
                console.log(`클릭한 시작점 인덱스: ${i}`);
                console.log(`최종 도착점 인덱스: ${result.endCol}`);
                console.log(`예상 결과: ${finalResultInput.value}`);
                console.log(`-------------------------`);

                animatePath(result);
                break;
            }
        }
    }
});

// --- 페이지 로드 시 초기 실행 ---
initializeGame();