var monster, monsterImg,monster_caught;
var girl, girlImg,girl1Img, girl2Img, girl_collided;
var softToy1, softToy2, softToy3, softToy4, softToy5;
var obstacle1, obstacle2, obstacle3;
var bg, bgImg;
var invisibleG;
var toysGroup, obstaclesGroup;
var toysCollected = 0, lives = 3;
var box, boxImg;
var START = 0;
var PLAY = 1;
var END = 2;
var gameState = PLAY;

var gameOver, gameOverimg, restart, restartimg;

function preload(){

  monsterImg = loadAnimation("images/monster1.png", "images/monster2.png", "images/monster3.png","images/monster4.png","images/monster5.png", "images/monster6.png", 
  "images/monster7.png","images/monster8.png", "images/monster9.png", "images/monster10.png");

  girlImg = loadAnimation("images/girl1.png", "images/girl2.png", "images/girl3.png", "images/girl4.png", 
  "images/girl5.png", "images/girl6.png", "images/girl7.png", "images/girl8.png");

  girl1Img = loadAnimation("images/girl1 - Copy.png", "images/girl2 - Copy.png", "images/girl3 - Copy.png", "images/girl4 - Copy.png", 
  "images/girl5 - Copy.png", "images/girl6 - Copy.png", "images/girl7 - Copy.png", "images/girl8 - Copy.png");

  girl2Img = loadAnimation("images/girl1 - Copy (2).png", "images/girl2 - Copy (2).png", "images/girl3 - Copy (2).png", "images/girl4 - Copy (2).png", 
  "images/girl5 - Copy (2).png", "images/girl6 - Copy (2).png", "images/girl7 - Copy (2).png", "images/girl8 - Copy (2).png");


  softToy1 = loadImage("images/bear.png");
  softToy2 = loadImage("images/jerry.png");
  softToy3 = loadImage("images/panda.png");
  softToy4 = loadImage("images/pikachu.png");
  softToy5 = loadImage("images/pusheen.png");

  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");

  bgImg = loadImage("images/bg.jpg");
  boxImg = loadImage("images/boximg.png");

  girl_collided = loadImage("images/girl6 - Copy (2).png");
  monster_caught = loadImage("images/monster4.png");

  gameOverimg = loadImage("images/gameOver.png");
  restartimg = loadImage("images/restart.png");

}


function setup() {
  createCanvas(800,400);

  bg = createSprite(width/2, height/2, width, height);
  bg.addImage(bgImg);
  bg.velocityX = -5;

  girl = createSprite(400, height-120, 50, 50);
  girl.addAnimation("girl running", girlImg);
  girl.addAnimation("girl running 1", girl1Img);
  girl.addAnimation("girl running 2", girl2Img);
  girl.addAnimation("collided", girl_collided);
  girl.setCollider("rectangle",0,0,40, girl.height);
  // girl.debug = true;

  monster = createSprite(100, height-130, 50, 50);
  monster.addAnimation("monster running", monsterImg);
  monster.addAnimation("caught", monster_caught);
  monster.setCollider("rectangle", 0,0, 55, monster.height);
  //monster.debug = true;

  invisibleG = createSprite(width/2, height-55, width, 20);
  invisibleG.visible = false;

  box = createSprite(width-90, 60, 170, 80);
  box.addImage(boxImg);
  box.scale = 0.5;

  gameOver = createSprite(width/2, height/2-90);
  gameOver.addImage(gameOverimg);
  gameOver.scale = 0.9;
  gameOver.visible = false;

  restart = createSprite(width/2-10, height/2-50);
  restart.addImage(restartimg);
  restart.scale = 0.7;
  restart.visible = false;

  
  obstaclesGroup = new Group();
  toysGroup = new Group();
}

function draw() {
  background(0);  

 
  girl.collide(invisibleG);
  monster.collide(invisibleG);

  if(gameState === PLAY){

    spawnObstacles();
    spawnToys();

    if(bg.x <0){
      bg.x = bg.width/2
    }

    if(keyDown("space")){
      girl.velocityY = -15;
    }
    girl.velocityY = girl.velocityY+ 0.6;

    if(girl.isTouching(toysGroup)){
      toysCollected+=1;
      for(var i=0; i< toysGroup.length; i++){
        var toy = toysGroup.get(i);
        if(girl.isTouching(toy)){
          toy.destroy();
        }
      }
    }

    if(girl.isTouching(obstaclesGroup)){
      lives = lives-1;
      
      for(var i=0; i<obstaclesGroup.length; i++){
        var obstacle = obstaclesGroup.get(i);
        if(girl.isTouching(obstacle)){
          obstacle.destroy();
        }
      }
      if(lives === 2){
        girl.changeAnimation("girl running 1", girl1Img);
      }else if(lives === 1){
        girl.changeAnimation("girl running 2", girl2Img);
      }
    }
    if(lives===0){
      gameState = END;

    }
  }

  if(gameState === END){

    bg.velocityX = 0;
    girl.changeAnimation("collided", girl_collided);
    monster.velocityX = 3;
    if(monster.isTouching(girl)){
      monster.velocityX = 0;
      monster.changeAnimation("caught", monster_caught);
    }

  }


  drawSprites();
  textSize(16);
  fill("black");
  text("Toys Collected: "+ toysCollected, width-150, 50);
  text("Lives: "+ lives, width-150, 70);
}

function spawnObstacles(){

  if(frameCount%150===0){
    var obstacle = createSprite(width, height-95, 20, 30);
    obstacle.velocityX = -4;
    obstacle.setCollider('circle',0,0,45);

    var rand = Math.round(random(1,3));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
      obstacle.scale = 0.5;
      break;
      case 2: obstacle.addImage(obstacle2);
      obstacle.scale = 0.3;
      break;
      case 3: obstacle.addImage(obstacle3);
      obstacle.scale = 0.2;
      break;
      default: break;
    }
    
    obstacle.lifetime = 500;
    obstacle.depth = girl.depth;
    obstacle.depth+=1;
    obstaclesGroup.add(obstacle);
  }
}

function spawnToys(){
  if(frameCount%120===0){
    console.log("here");
    var toy = createSprite(width, random(height-260,height-210),40, 40 );
    toy.velocityX = -2;

    var rand = Math.round(random(1,5));
    switch(rand){
      case 1: toy.addImage(softToy1);
      toy.scale = 0.3;
      break;
      case 2: toy.addImage(softToy2);
      toy.scale = 0.2;
      break;
      case 3: toy.addImage(softToy3);
      toy.scale = 0.2;
      break;
      case 4: toy.addImage(softToy4);
      toy.scale = 0.05;
      break;
      case 5: toy.addImage(softToy5);
      toy.scale = 0.2;
      break;
      default: break;
    }
    toy.lifetime = 500;
    toy.depth = girl.depth;
    girl.depth += 1;
    toysGroup.add(toy);
    // toy.debug = true;
  }
}