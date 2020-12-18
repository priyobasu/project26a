var player1ani, player2ani;
var player1,player2;
var redscore=0;
var yellow=0;
var database;
var player1pos,player2pos;
var gameState;
var r;
var player1score,player2score;
var position1,position2;
function preload()
{
player1ani=loadAnimation("images/player1a.png","images/player1b.png","images/player1a.png");
player2ani=loadAnimation("images/player2a.png","images/player2b.png","images/player2a.png");
}
function setup()
{
createCanvas(800,800);
database=firebase.database();
player1=createSprite(100,400,10,10);
player1.addAnimation("walking",player1ani);
player1.scale=0.5;
player2=createSprite(700,400,10,10);
player2.addAnimation("walking",player2ani);
player2.scale=0.5;

player1pos=database.ref('player1/position');
player1pos.on("value",readPos1,showError);
player2pos=database.ref('player2/position');
player2pos.on("value",readPos2,showError);

gameState=database.ref('gameState/');
gameState.on("value",readGameState,showError);

player1score=database.ref('player1score/');
player1score.on("value",p1score,showError);

player2score=database.ref('player2score/');
player2score.on("value",p2score,showError);

}
function draw()
{
    background("lightblue");
    for(var i=0;i<=800;i=i+20)
    {
        stroke("black");
        strokeWeight(2);
        line(400,i,400,i+10);
    }
    for(var i=0;i<=800;i=i+20)
    {
        stroke("yellow");
        strokeWeight(2);
        line(100,i,100,i+10);
    }
    for(var i=0;i<=800;i=i+20)
    {
        stroke("red");
        strokeWeight(2);
        line(700,i,700,i+10);
    }
    stroke("black");
    strokeWeight(1);
    textSize(30);

    text("YELLOW "+yellow, 150,40);
    text("RED "+redscore,550,40);


    if(gameState===0){
        textSize(30);
        fill("red");
        text("Press space to toss",400,400);
        if(keyDown==="space"){
           r=Math.round(random(1,2));
           if(r===1){
            database.ref('/').update({
                'gameState':1
            })
          alert("red player");  
        }
        if(r===1){
            database.ref('/').update({
                gameState:2
            })
          alert("YELLOW player");  
        }
        database.ref('player1/position').update({
            'x':100,
            'y':400
        })
        database.ref('player2/position').update({
            'x':700,
            'y':400
        })
    }
}// gameState 0 ends

if(gameState===1){

    if(keyDown("a"))
  {
    changePositionred(-10,0);
  }
  else if(keyDown("d"))
  {
    changePositionred(10,0);
  }
  else if(keyDown("w"))
  {
   changePositionred(0,-10);
  }
  else if(keyDown("s"))
  {
    changePositionred(0,10);
  }


  if(keyDown("UP_ARROW"))
  {
   changePositionyellow(0,-10);
  }
  else if(keyDown("DOWN_ARROW"))
  {
    changePositionyellow(0,10);
  }

  if(player1.x>700 || player2.isTouching(player1)){
      database.ref('/').update({
          'player1score':player1score-5,
          'player2score':player2score+5,
          'gameState':0
      })
      alert("RED PLAYER LOST");
  }
} // GAMESTATE 1 END


if(gameState===2){

    if(keyDown("LEFT_ARROW"))
  {
    changePositionyellow(-10,0);
  }
  else if(keyDown("RIGHT_ARROW"))
  {
    changePositionyellow(10,0);
  }
  else if(keyDown("UP_ARROW"))
  {
   changePositionyellow(0,-10);
  }
  else if(keyDown("DOWN_ARROW"))
  {
    changePositionyellow(0,10);
  }


  if(keyDown("w"))
  {
   changePositionred(0,-10);
  }
  else if(keyDown("s"))
  {
    changePositionred(0,10);
  }

  if(player2.x<100 || player2.isTouching(player1)){
      database.ref('/').update({
          'player2score':player2score-5,
          'player1score':player1score+5,
          'gameState':0
      })
      alert("YELLOW PLAYER LOST");
    }

     
 
}// GAME STATE 2 END




drawSprites();

}

function changePositionred(x,y)
{
  database.ref('player1/position').set({
  'x':position1.x+x,
  'y':position1.y+y 
  })
}

  function changePositionyellow(x,y)
{
  database.ref('player2/position').set({
  'x':position2.x+x,
  'y':position2.y+y 
  })
}

function readPos1(data)
{
position1=data.val();
player1.x=position1.x;
player1.y=position1.y;
}

function readPos2(data)
{
position2=data.val();
player2.x=position2.x;
player2.y=position2.y;
}

function readGameState(data){
    gameState=data.val();
}
function p1score(data){
    redscore=data.val();
}
function p2score(data){
    yellow=data.val();
}

function showError(){
    console.log("Error in writing to the database");
  }