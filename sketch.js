var canvas;
var backgroundImage;
var database, gameState;
var form, player, playerCount;
var allPlayers;
var car1,car2,carimg1,carimg2,track;
var cars=[]
var fuels,powercoins,obstacles;
var fuelimg,powercoinimg,obstacleimg1,obstacleimg2;
var lifeimg;
var blast;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carimg1 = loadImage("./assets/car1.png");
  carimg2 = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuelimg = loadImage('./assets/fuel.png');
  powercoinimg = loadImage('./assets/goldCoin.png');
  obstacleimg1 = loadImage('./assets/obstacle1.png');
  obstacleimg2 = loadImage('./assets/obstacle2.png');
  lifeimg = loadImage('./assets/life.png');
  blast = loadImage('./assets/blast.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount===2) {
    game.update(1)
  }

  if (gameState===1) {
    game.play()
  }

  if (gameState===2) {
    game.showliderbord()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
