let bg, librarian, player, bookshelf, obstacle1, obstacle2, obstacle3, x1 = 0, x2, x3, scroll = 2, sonata, pj, hp, hg, soc, book, score = 0, bookx = 0, booky = 0, collectSound, wahSound, scoreBox, won = false, winning, wham, winSound, bookPresent = false, obstaclePresent = false, upstairsObstacle = false, x4, libraryFont, noHome = false, startButton, restartButton, timeLeft = 5000, timeRemaining, y, y2, hpCollected = false, hgCollected = false, socCollected = false, pjCollected = false, powerUpTime = 200, powerUp, powerOn = false, sixUp, timeDown, timer = 50, info, onInfo = false, backButton, highScore = 0, highScoreBox, endScore;

function preload() {
  bg = loadImage("assets/library.png");
  librarian = loadImage("assets/librarian-removebg-preview.png");
  bookshelf = loadImage("assets/bookshelf 1.png");
  sonata = loadSound("assets/Beethoven - Moonlight Sonata (FULL).mp3");
  pj = loadImage("assets/pj.png");
  hp = loadImage("assets/harry potter.jpg");
  hg = loadImage("assets/hunger games.jpg");
  soc = loadImage("assets/sixofcrows.png");
  collectSound = loadSound("assets/Twinkle Sound Effect - No Copyright (HD).mp3");
  wham = loadSound("assets/Wham sound effect.mp3");
  winSound = loadSound("assets/success-fanfare-trumpets-6185 (1).mp3");
  libraryFont = loadFont("assets/PT_Mono/PTMono-Regular.ttf");
}

function setup() {
  createCanvas(800, 600);
  background(255);

  world.gravity.y = 2;
  
  player = new Sprite(100, height-125, 50, 100, 'k');
  player.layer = 3;
  player.image = librarian;
  player.scale = 0.5;
  x2 = width;

  sonata.play();
  sonata.loop();

  scoreBox = new Sprite(75, 50, 125, 50, 'none');
  scoreBox.color = 'white';
  scoreBox.textSize = 20;
  scoreBox.textFont = libraryFont;
  scoreBox.visible = false;

  highScoreBox = new Sprite(250, 50, 200, 50, 'none');
  highScoreBox.color = 'white';
  highScoreBox.textSize = 20;
  highScoreBox.textFont = libraryFont;
  highScoreBox.visible = false;

  winningBox = new Sprite(width/2, height/2, 200, 100, 'none');
  winningBox.color = 'white';
  winningBox.visible = false;
  winningBox.textSize = 30;

  endScore = new Sprite(width/2, height/2+100, 200, 50, 'none');
  endScore.color = 'white';
  endScore.visible = false;
  endScore.textSize = 15;

  startButton = new Sprite(width/2-100, height/2+200, 150, 50, 'static');
  startButton.text = "Click to begin.";
  startButton.color = 'white';

  info = new Sprite(width/2+100, height/2+200, 150, 50, 'static');
  info.text = "Instructions";
  info.color = 'white';

  backButton = new Sprite(width/2, height/2+200, 150, 50, 'static');
  backButton.text = "Back to home.";
  backButton.color = 'white';
  backButton.visible = false;

  restartButton = new Sprite(-4000, -4000, 150, 50, 'static');
  restartButton.text = "Click to restart.";
  restartButton.color = 'white';

  timeRemaining = new Sprite(width-175, 50, 300, 50, 'none');
  timeRemaining.color = 'white';
  timeRemaining.textSize = 20;
  timeRemaining.visible = false;

  powerUp = new Sprite(width-225, height-50, 400, 50, 'static');
  powerUp.color = 'yellow';
  powerUp.textSize = 20;
  powerUp.visible = false;

  sixUp = new Sprite(75, 100, 100, 50, 'static');
  sixUp.textSize = 20;
  sixUp.color = 'yellow';
  sixUp.text = "+6";
  sixUp.visible = false;

  timeDown = new Sprite(width-75, 100, 100, 50, 'static');
  timeDown.textSize = 20;
  timeDown.color = 'yellow';
  timeDown.text = "-100";
  timeDown.visible = false;
}

function draw() {
  if (!won) {
    if (!noHome) {
      background(bg);
      textFont(libraryFont);
      textSize(20);
      fill('white');
      rectMode(CENTER);
      rect(width/2, height/2, 700, 300);
      fill('black');
      textAlign(CENTER, CENTER);
      if (!onInfo) {
        text("Welcome to Library Dash!\n\nUse the arrow keys to move through the library,\n collecting treasured books along the way.\n Beware the obstacles from above and below\nwhich will steal your books\nand send you back to the start.\n\nRemember, books are the most powerful form of magic\nand hope there is to be found ...", width/2, height/2);
      }
      if (startButton.mouse.pressing()) {
        noHome = true;
        startButton.pos = {x:-2000, y:-2000};
        info.visible = false;
      }
      if (onInfo || info.mouse.pressing()) {
        startButton.visible = false;
        onInfo = true;
        info.visible = false;
        backButton.visible = true;
        textSize(15.5);
        text("Use the arrow keys to move up and down.\nAvoid bookshelves! Hitting them will reset your game.\n\nCollect books! Each book has a different power:\nHarry Potter: Causes all obstacles for the next 200 frames to disappear\nPercy Jackson: Causes the gameplay to speed up 3x for the next 200 frames\nHunger Games: Decreases the game time remaining by 100 frames\nSix of Crows: Adds 6 books to your score\n\nMake it through 5000 frames of the game to win!", width/2, height/2);
        if (backButton.mouse.presses()) {
          onInfo = false;
          backButton.visible = false;
          info.visible = true;
          startButton.visible = true;
        }
      }
    }
    else {
      scoreBox.visible = true;
      timeRemaining.visible = true;
      highScoreBox.visible = true;
      backgroundScroll();
      playerMovement();
      checkWon();
      if (!hpCollected) {
        generateObstacle();
        generateUp();
        scrollObstacle();
        obstacleCollide();
        scrollObstacle2();
        obstacle2Collide();
      }
      generateBook();
      scrollBook();
      collectBook();
      powerUpTimer();
      checkHighScore();
      timeLeft --;
    }
  }

  else {
    if (restartButton.mouse.presses()) {
      reseted();
    }
  }
}

function backgroundScroll() {
  image(bg, x1, 0, width, height);
  image(bg, x2, 0, width, height);
  scoreBox.text = "Score: " + score;
  timeRemaining.text = "Time Remaining: " + timeLeft;
  highScoreBox.text = "High Score: " + highScore;
  x1 -= scroll;
  x2 -= scroll;
  if (x1 < - width) {
    x1 = width;
  }
  if (x2 < - width) {
    x2 = width;
  }
}

function playerMovement() {
  player.vel.x = 0;
  
    player.x = player.x - scroll;
    if (kb.pressing("up")) {
      player.vel.y = -3;
    }
    else {
      player.vel.y = world.gravity.y;
    }

  if (player.y > height-125) {
    player.y = height-125;
  }

  if (player.y < 125) {
    player.y = 125;
  }

  if (player.x < 100) {
    player.x = 100;
  }
}

function checkWon() {
  if (timeLeft <= 0) {
    timeLeft = 0;
    timeRemaining.visible = false;
    player.x = width-100;
    if (obstaclePresent) {
      obstacle1.visible = false;
    }
    
    if (upstairsObstacle) {
      obstacle2.visible = false;
    }
    
    upstairsObstacle = false;
    obstaclePresent = false;
    sixUp.visible = false;
    timeDown.visible = false;
    bookPresent = false;
    powerUpTimer.visible = false;
    powerOn = false;
    if (book != null) {
     book.pos = {x:-500, y:-500}; 
    }
    player.visible = false;
    player.pos = {x:-1500, y:-1500};
    winningBox.text = "You Won!";
    winningBox.visible = true;
    endScore.text = "Final Score: " + score;
    endScore.visible = true;
    restartButton.pos = {x:width/2, y:height/2+175};
    sonata.stop();
    winSound.play();
    won = true;
  }
}

function reseted() {
  won = false;
  winningBox.visible = false;
  restartButton.pos = {x:-4000, y:-4000};
  endScore.visible = false;
  player.pos = {x:100, y:height-125};
  player.visible = true;
  timeLeft = 5000;
  score = 0;
  powerOn = false;
  hpCollected = false;
  hgCollected = false;
  pjCollected = false;
  socCollected = false;
  bookPresent = false;
  winSound.stop();
  sonata.play();
  sonata.loop();
}

function generateBook() {
  if (pjCollected) {
    scroll = 6;
  }
  else {
    scroll = 2;
  }
  if (!bookPresent && random(5) < 2) {
    bookx = random(player.x+200, width-100);
    booky = random(200, height-300);
    book = new Sprite(bookx, booky, 50, 100, 'static');
    book.layer = 1;
  
    let num = int(random(4));
    if (num == 0) {
      book.image = pj;
      book.scale = 0.2;
    }
    else if (num == 1) {
      book.image = hp;
      book.scale = 0.05;
    }
    else if (num == 2) {
      book.image = hg;
      book.scale = 0.3;
    }
    else {
      book.image = soc;
      book.scale = 0.15;
    }

  bookPresent = true;
  }
}

function scrollBook() {
  if (bookPresent) {
    book.x = book.x - scroll;
    
    if (bookx < player.x-200) {
      book.pos = {x:-200, y:-200};
      book = null;
      bookPresent = false;
    }  
  }  
}

function collectBook() {
  if (bookPresent) {
    if (Math.abs(player.x-book.x) < 25) {
      book.pos = {x:-200, y:-200};
      if (book.image == hp) {
        hpCollected = true;
        if (obstacle1 != null) {
          obstacle1.pos = {x:-6000, y:-6000};
          obstacle1 = null;
        }
        if (obstacle2 != null) {
          obstacle2.pos = {x:-7000, y:-7000};
          obstacle2 = null;
        }
        obstaclePresent = false;
        upstairsObstacle = false;
        powerOn = true;
      }
      else if (book.image == hg) {
        hgCollected = true;
        timeLeft -= 100;
        timeDown.visible = true;
      }
      else if (book.image == pj)  {
        pjCollected = true;
        powerOn = true;
      }
      else {
        socCollected = true;
        score+=5;
        sixUp.visible = true;
      }
      book = null;
      bookPresent = false;
      score ++;
      collectSound.play();
    }
  }
}

function generateObstacle() {
  if (!obstaclePresent && random(5)<2) {
    x3 = random(player.x+100, width-100);
    y = random(height-75, height-125);
    obstacle1 = new Sprite(x3, y, 100, 100, 'static');
    obstacle1.image = bookshelf;
    obstacle1.scale = 0.2;
    obstacle1.layer = 2;
    obstaclePresent = true;
  }
}

function scrollObstacle() {
  if (obstaclePresent) {
    x3 -= scroll;
    obstacle1.pos = {x: x3, y:y};
    if (x3 < player.x-200) {
      obstaclePresent = false;
      obstacle1.pos = {x:-500, y:-500};
    }
  }
}

function obstacleCollide() {
  if (obstaclePresent) {
    if (Math.abs(player.x-obstacle1.x)<100 && Math.abs(player.y-obstacle1.y)<100) {
      player.x = 0;
      player.y = height;
      if (score > 0) {
        score = 0;
      }
      timeLeft = 5000;
      obstacle1.pos = {x:-500, y:-500};
      obstaclePresent = false;
      wham.play();
    }
  }
}

function generateUp() {
  if (!upstairsObstacle && random(5)<2) {
    x4 = random(player.x+100, width-100);
    y2 = random(75, 125);
    obstacle2 = new Sprite(x3, y2, 100, 100, 'static');
    obstacle2.image = bookshelf;
    obstacle2.scale = 0.2;
    obstacle2.layer = 2;
    upstairsObstacle = true;
  }
}

function obstacle2Collide() {
  if (upstairsObstacle) {
    if (Math.abs(player.x-obstacle2.x)<100 && Math.abs(player.y-obstacle2.y)<100) {
      player.x = 0;
      player.y = height;
      if (score > 0) {
        score = 0;
      }
      timeLeft = 5000;
      obstacle2.pos = {x:-750, y:-750};
      upstairsObstacle = false;
      wham.play();
    }
  }
}

function scrollObstacle2() {
  if (upstairsObstacle) {
    x4 -= scroll;
    player.x += scroll;
    obstacle2.pos = {x: x4, y:y2};
    if (x4 < player.x-200) {
      upstairsObstacle = false;
      obstacle2.pos = {x:-750, y:-750};
    }
  }
}

function powerUpTimer() {
  if (timer <= 0) {
    sixUp.visible = false;
    timeDown.visible = false;
    timer = 100;
  }
  else {
    timer--;
  }
  
  if (powerOn) {
    powerUp.visible = true;
    powerUp.text = "Power Time Remaining: " + powerUpTime;
    powerUpTime--;
    if (powerUpTime == 0) {
      powerOn = false;
    }
  }
  else {
    powerUpTime = 200;
    powerUp.visible = false;
    hgCollected = false;
    hpCollected = false;
    socCollected = false;
    pjCollected = false;
  }
}

function checkHighScore() {
  if (score > highScore) {
    highScore = score;
  }
}
