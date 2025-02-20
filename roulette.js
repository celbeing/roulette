const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("spinButton");
const gauge = document.getElementById("powerGauge");

const prizes = [
    { label: "올리브영 상품권", amount: 10000, angle: 36 },
    { label: "언빌리버블 버거 세트", amount: 10000, angle: 36 },
    { label: "허쉬 초콜릿칩 쿠키", amount: 10000, angle: 36 },
    { label: "배라 파인트", amount: 10000, angle: 36 },
    { label: "맘스터치 싸이버거 단품", amount: 5000, angle: 48 },
    { label: "GS25 1만원", amount: 10000, angle: 36 },
    { label: "다이소 1만원", amount: 10000, angle: 36 },
    { label: "메가커피 1만원", amount: 10000, angle: 36 },
    { label: "머그컵, 인형키링 세트", amount: 10000, angle: 36 },
    { label: "카톡선물하기 15000원", amount: 15000, angle: 24 }
];

const sections = prizes.map(prize => ({
    label: prize.label,
    angle: prize.angle
}));

let rotationAngle = 0;
let spinning = false;
let speed = 0;
let holdTime = 0;
let gaugeValue = 0;
let gaugeRunning = false;

function drawRoulette() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    let startAngle = Math.PI * 1.5;
    
    sections.forEach((section, index) => {
        const endAngle = startAngle + (section.angle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = `hsl(${index * 139}, 100%, 80%)`;
        ctx.fill();
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + (section.angle * Math.PI / 360));
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(section.label, radius * 0.6, 0);
        ctx.restore();
        
        startAngle = endAngle;
    });
}

drawRoulette();

function drawArrow() {
    const centerX = canvas.width / 2;
    const arrowSize = 20;
    ctx.beginPath();
    ctx.moveTo(centerX - arrowSize, 10);
    ctx.lineTo(centerX + arrowSize, 10);
    ctx.lineTo(centerX, 30);
    ctx.fillStyle = "red";
    ctx.fill();
}

button.addEventListener("mousedown", () => {
    holdTime = Date.now();
    gaugeValue = 0;
    gaugeRunning = true;
    updateGauge();
});

button.addEventListener("mouseup", () => {
    let duration = Date.now() - holdTime;
    speed = duration / 20;
    if (speed > 5) {
        spinning = true;
        rotateWheel();
    }
    else {
      speed = Math.random() * 10 + 5;
      spinning = true;
      rotateWheel();
    }
    gaugeRunning = false;
});

function updateGauge() {
    if (!gaugeRunning) return;
    gaugeValue = Math.min((Date.now() - holdTime) / 10, 100);
    gauge.style.width = `${gaugeValue}%`;
    requestAnimationFrame(updateGauge);
}

function rotateWheel() {
    if (!spinning) return;
    rotationAngle = (rotationAngle + speed) % 360; // 360도를 초과하지 않도록 보정
    speed *= speed > 2 ? 0.98 : 0.99; // 속도가 작아질수록 감속 완화
    if (speed < 0.1) {
        spinning = false;
        determinePrize();
        return;
    }
    drawRotatedRoulette();
    requestAnimationFrame(rotateWheel);
}


function drawRotatedRoulette() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawRoulette();
    ctx.restore();
    drawArrow();
}

function determinePrize() {
    let adjustedDegrees = rotationAngle % 360;
    let cumulativeAngle = 0
    
    for (let i = sections.length - 1; i >= 0; i--) { // 역순으로 확인
        cumulativeAngle += sections[i].angle;
        if (adjustedDegrees < cumulativeAngle) {
            alert(`당첨: ${sections[i].label}!`);
            return;
        }
    }
}

drawArrow();

