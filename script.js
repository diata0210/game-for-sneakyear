const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let timeLeft = 35; // Change back to 35
let bonusFood = null;
let bonusFoodTimer = 0;
let isGameOver = false;

const riddles = []; // Câu đố

// Hàm vẽ rắn
function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = "#32CD32";
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
    ctx.strokeStyle = "#006400";
    ctx.strokeRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );

    // Vẽ đầu rắn
    if (index === 0) {
      ctx.fillStyle = "#32CD32";
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
      ctx.strokeStyle = "#006400";
      ctx.strokeRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );

      // Vẽ mắt rắn
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(
        segment.x * gridSize + gridSize / 4,
        segment.y * gridSize + gridSize / 4,
        5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        segment.x * gridSize + (3 * gridSize) / 4,
        segment.y * gridSize + gridSize / 4,
        5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  });
}

// Hàm vẽ phong bao lì xì
function drawFood() {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Hàm vẽ phong bao lì xì thưởng
function drawBonusFood() {
  if (bonusFood) {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bonusFood.x * gridSize, bonusFood.y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = "#FF8C00";
    ctx.strokeRect(bonusFood.x * gridSize, bonusFood.y * gridSize, gridSize, gridSize);
  }
}

// Hàm vẽ chướng ngại vật
function drawObstacles() {
  // Không cần vẽ chướng ngại vật
}

// Hàm cập nhật trò chơi
function update() {
  if (isGameOver) return;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Kiểm tra nếu rắn ăn phong bao lì xì
  if (timeLeft > 0 && head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    placeFood();

    // Đặt phong bao lì xì thưởng ngẫu nhiên
    if (score % 5 === 0) {
      placeBonusFood();
    }
  } else if (timeLeft > 0 && bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
    score += 5;
    document.getElementById("score").textContent = score;
    bonusFood = null;
  } else {
    snake.pop();
  }

  // Kiểm tra va chạm với tường hoặc chính mình
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOver").style.display = "block";
    isGameOver = true;
    clearInterval(window.countdownTimer); // Stop the countdown timer
    return;
  }

  // Đếm ngược thời gian cho phong bao lì xì thưởng
  if (bonusFoodTimer > 0) {
    bonusFoodTimer--;
    if (bonusFoodTimer === 0) {
      bonusFood = null;
    }
  }
}

// Hàm hiển thị câu đố
function showRiddle() {
  // Không cần hiển thị câu đố
}

// Hàm kiểm tra câu trả lời
function checkRiddle(answer) {
  // Không cần kiểm tra câu trả lời
}

// Hàm đặt phong bao lì xì ngẫu nhiên
function placeFood() {
  do {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  } while (
    snake.some((segment) => segment.x === food.x && segment.y === food.y)
  );
}

// Hàm đặt phong bao lì xì thưởng ngẫu nhiên
function placeBonusFood() {
  do {
    bonusFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (
    snake.some((segment) => segment.x === bonusFood.x && segment.y === bonusFood.y)
  );
  bonusFoodTimer = 50; // Thời gian tồn tại của phong bao lì xì thưởng
}

// Hàm reset game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  timeLeft = 35; // Change back to 35
  isGameOver = false;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  placeFood();
}

// Hàm vẽ game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  drawBonusFood();
  // Không cần vẽ chướng ngại vật
}

// Lắng nghe sự kiện bàn phím
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Hàm đếm ngược thời gian
function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
  } else {
    alert("Hết giờ! Lì xì của bạn: " + score);
    resetGame();
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 100);
}

// Hàm khởi động lại game
function restartGame() {
  document.getElementById("gameOver").style.display = "none";
  resetGame();
  // Thay vì bắt đầu game mới ngay lập tức, hiển thị modal hướng dẫn
  showInstructions();
  // Clear existing interval
  clearInterval(window.countdownTimer);
}

// Hàm khởi động game
function startGame() {
  document.getElementById("startModal").style.display = "none";
  resetGame();
  window.countdownTimer = setInterval(countdown, 1000);
  gameLoop();
}

// Hiển thị modal hướng dẫn
function showInstructions() {
  document.getElementById("startModal").style.display = "block";
}

// Khởi động game
// Remove the initial calls to placeFood, gameLoop, and setInterval(countdown, 1000)
document.addEventListener("DOMContentLoaded", showInstructions);
