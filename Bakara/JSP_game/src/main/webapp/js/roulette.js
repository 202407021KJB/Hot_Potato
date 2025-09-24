console.log("roulette.js 로드됨 ✅ (vFinal)");

// --- DOM 요소 가져오기 ---
const optionsContainer = document.getElementById('options-container');
const spinBtn = document.getElementById('spin-btn');
const canvas = document.getElementById('roulette-canvas');
const ctx = canvas.getContext('2d');

// --- 전역 변수 ---
const options = ['🍌', '🍎'];
const colors = ['#FF677D', '#ADD8E6'];

// --- 함수 ---

// 룰렛 초기화 함수
function initializeRoulette() {
    optionsContainer.innerHTML = '';
    // 옵션 입력 상자 생성 로직 삭제

    drawRoulette();
    spinBtn.disabled = false;
}

// 룰렛 돌리기 함수 (서버에 결과 요청)
function spinRoulette() {
    if (spinBtn.disabled) return;

    // 버튼 비활성화
    spinBtn.disabled = true;

    const params = new URLSearchParams();
    options.forEach(opt => params.append('option', opt));

    const contextPath = document.getElementById('game-container').dataset.contextPath;
    fetch(`${contextPath}/roulette?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('서버와 통신에 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            const winner = data.winner;
            const winnerIndex = options.indexOf(winner);
            
            console.log("--- 룰렛 디버그 로그 ---");
            console.log("서버에서 받은 당첨자: ", winner);
            console.log("계산된 winnerIndex: ", winnerIndex);

            if (winnerIndex === -1) {
                throw new Error('서버로부터 받은 결과가 유효하지 않습니다.');
            }
            startAnimation(winnerIndex, options.length, winner);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
            spinBtn.disabled = false; // 에러 발생 시 버튼 다시 활성화
        });
}

// 애니메이션 시작 함수
function startAnimation(winnerIndex, numOptions, winnerName) {
    const arcSize = (2 * Math.PI) / numOptions;
    
            let targetAngle;
    if (winnerName === '당첨') {
        targetAngle = 0; // '당첨'일 경우 0도 회전 (시각적으로 270도에 오도록)
    } else { // winnerName === '꽝'
        targetAngle = Math.PI; // '꽝'일 경우 180도 회전 (시각적으로 270도에 오도록)
    }

    console.log("계산된 targetAngle (라디안): ", targetAngle);
    console.log("계산된 targetAngle (도): ", targetAngle * 180 / Math.PI);

    const randomSpins = 5 + Math.random() * 3;
    const totalRotation = (randomSpins * 2 * Math.PI) + targetAngle;

    let startTimestamp = null;
    const duration = 5000; // 5초

    function rotate(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;

        if (progress >= duration) {
            // 애니메이션 종료 시 최종 위치에 정확히 스냅
            ctx.save();
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(totalRotation); // 최종 목표 각도로 회전
            ctx.translate(-centerX, -centerY);
            drawRoulette();
            ctx.restore();

            setTimeout(() => {
                                alert(`룰렛 결과: 

🎉 ${winnerName} 🎉`);
                spinBtn.disabled = false;
            }, 100);
            return;
        }
        
        const easeOut = 1 - Math.pow(1 - (progress / duration), 4);
        const currentAngle = totalRotation * easeOut;

        ctx.save();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle);
        ctx.translate(-centerX, -centerY);
        drawRoulette();
        ctx.restore();

        requestAnimationFrame(rotate);
    }

    requestAnimationFrame(rotate);
}

// 룰렛 그리는 함수
function drawRoulette() {
    const numOptions = options.length;
    if (numOptions === 0) return;

    const arcSize = (2 * Math.PI) / numOptions;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;

    for (let i = 0; i < numOptions; i++) {
        const startAngle = i * arcSize;
        const endAngle = (i + 1) * arcSize;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = '#000';
                ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textX = centerX + (radius / 1.5) * Math.cos(startAngle + arcSize / 2);
        const textY = centerY + (radius / 1.5) * Math.sin(startAngle + arcSize / 2);
        
        ctx.translate(textX, textY);
        ctx.rotate(startAngle + arcSize / 2 + Math.PI / 2);
        ctx.fillText(options[i], 0, 0);
        ctx.restore();
    }
}

// --- 이벤트 리스너 ---
spinBtn.addEventListener('click', spinRoulette);

// --- 페이지 로드 시 초기 실행 ---
initializeRoulette();