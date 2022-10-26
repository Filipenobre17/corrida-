class Game {
  constructor() {
    this.resettitle=createElement('h2')
    this.resetButton = createImg("./assets/reset.png");
    this.resetButton.size(60,60)
    this.liderbordtitle=createElement('h2')

    this.lider1=createElement('h2')
    this.lider2=createElement('h2')
    this.playermoving=false
    this.leftKeyActive=false
    this.blast=false
  }

 getState(){
  var gameStateref = database.ref('gameState');
  gameStateref.on('value',function(data){
    gameState=data.val()
  })
 }
update(state){
  database.ref('/').update({
    gameState:state
  })
}
  start() {
    player = new Player();
    playerCount=player.getCount();
    form = new Form();
    form.display();

    car1=createSprite(width/2-50,height-100)
    car1.addImage('car1',carimg1)
    car1.scale=0.07
    car1.addImage('blast',blast)

    car2=createSprite(width/2+100,height-100)
    car2.addImage('car2',carimg2)
    car2.scale=0.07
    car2.addImage('blast',blast)

    cars=[car1,car2]

    fuels = new Group()
    powercoins = new Group()
    obstacles = new Group()

    var obstaclesPositions = [
       { x: width / 2 + 250, y: height - 800, image: obstacleimg2 },
        { x: width / 2 - 150, y: height - 1300, image: obstacleimg1 },
         { x: width / 2 + 250, y: height - 1800, image: obstacleimg1 },
          { x: width / 2 - 180, y: height - 2300, image: obstacleimg2 },
           { x: width / 2, y: height - 2800, image: obstacleimg2 },
            { x: width / 2 - 180, y: height - 3300, image: obstacleimg1 },
             { x: width / 2 + 180, y: height - 3300, image: obstacleimg2 },
              { x: width / 2 + 250, y: height - 3800, image: obstacleimg2 },
               { x: width / 2 - 150, y: height - 4300, image: obstacleimg1 },
                { x: width / 2 + 250, y: height - 4800, image: obstacleimg2 },
                 { x: width / 2, y: height - 5300, image: obstacleimg1 },
                  { x: width / 2 - 180, y: height - 5500, image: obstacleimg2 }
                 ];

    this.addsprites(fuels,4,fuelimg,0.02)
    this.addsprites(powercoins,18,powercoinimg,0.09)
    this.addsprites(obstacles,obstaclesPositions.length,obstacleimg1,0.04,obstaclesPositions)
  }

  addsprites(spriteGroup,numberOfSprites, spriteImage,scale,positions=[]){
    for (let i = 0; i < numberOfSprites; i++) {
      var x,y

      if (positions.length>0) {
        x=positions[i].x
        y=positions[i].y
        spriteImage=positions[i].image
      } else {
        x=random(width/2+150,width/2-150)
        y=random(-height*4.5,height-400)
      }
      

    var sprite=createSprite(x,y)
    sprite.addImage('sprite',spriteImage)
    sprite.scale=scale
    spriteGroup.add(sprite)
    }
  }

handleElements(){
  form.hide()
  form.titleImg.position(40,50)
  form.titleImg.class('gameTitleAfterEffect')

  this.resettitle.html('reiniciar jogo')
  this.resettitle.class('resetText')
  this.resettitle.position(width/2+200,40)

  this.resetButton.class('resetButton')
  this.resetButton.position(width/2+230,100)

  this.liderbordtitle.html('placar')
  this.liderbordtitle.class('resetText')
  this.liderbordtitle.position(width/3-60,40)

  this.lider1.class('leadersText') 
  this.lider1.position(width/3-50,80)
  
  this.lider2.class('leadersText')
  this.lider2.position(width/3-50,130)

}
  play(){
    this.handleElements()
    this.handleresetButton()
    Player.getplayersinfo()
    player.getCarsAtEnd()

    if (allPlayers!==undefined) {
      image(track,0,-height*5,width,height*6)
      this.showliderbord()
      this.showlife()
      this.showfuell()
      var index=0
      for (var plr in allPlayers) {
        index+=1
        var x=allPlayers[plr].positionX
        var y=height-allPlayers[plr].positionY

        cars[index-1].position.x=x
        cars[index-1].position.y=y

        var vidacorrente=allPlayers[plr].life
        if (vidacorrente<=0) {
          cars[index-1].changeImage('blast')
          cars[index-1].scale=0.3
        }

        if (index===player.index) {
          stroke(10)
          fill ('green')
          ellipse(x,y,60,60)

          this.handlefuel(index)
          this.handlepowercoins(index)
          this.handleObstacleColision(index)
          this.handlecarscolision(index)

          if (player.life<=0) {
            this.blast=true
            this.playermoving=false
          }

          camera.position.y=cars[index-1].position.y
        }
      }

      if (this.playermoving) {
        player.positionY+=5
        player.update()
      }
      this.handleplayerControls()

      const finishline=height*6-100
      if (player.positionY>finishline) {
        gameState=2
        player.rank+=1
        Player.updatecarsAtEnd(player.rank)
        player.update()
        this.showrank()
      }
      
      drawSprites()
    }
  }

  handlefuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel=185
      collected.remove()
    })
    if (player.fuel>0&&this.playermoving) {
     player.fuel-=0.3
    }
    if (player.fuel<=0) {
      gameState=2
      this.GameOver()
    }
  }

  handlepowercoins(index){
    cars[index-1].overlap(powercoins,function(collector,collected){
      player.score+=21
      collected.remove()
    })
  }

  handleresetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref('/').set({
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd:0
      })
      window.location.reload()
    })
  }

  showliderbord(){
    var lider1,lider2
    var players=Object.values(allPlayers)

    if ((players[0].rank===0&&players[1].rank===0)||
    players[0].rank===1) {
      lider1=
      players[0].rank+
      '&emsp;'+
      players[0].name+
      '&emsp;'+
      players[0].score;
      
      lider2=
      players[1].rank+
      '&emsp;'+
      players[1].name+
      '&emsp;'+
      players[1].score;
    }
    if (players[1].rank===1) {
      lider2=
      players[0].rank+
      '&emsp;'+
      players[0].name+
      '&emsp;'+
      players[0].score;
      
      lider1=
      players[1].rank+
      '&emsp;'+
      players[1].name+
      '&emsp;'+
      players[1].score;
    }

    this.lider1.html(lider1)
    this.lider2.html(lider2)
  }
  handleObstacleColision(index){
    if (cars[index-1].collide(obstacles)) {
      if(this.leftKeyActive){
        player.positionX+=100
      }else{
        player.positionX-=100
      }
      if (player.life>0) {
        player.life-=185/4
      }
      player.update()
    }
  }

  handleplayerControls(){
    if (!this.blast) {
      
    
      if (keyIsDown(UP_ARROW)) {
        this.playermoving=true
      
        player.positionY+=10
        player.update()
      }
    
      if (keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50) {
        this.leftKeyActive=true
        player.positionX-=5
        player.update()
      }

      if (keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300) {
        this.leftKeyActive=false
        player.positionX+=5
        player.update()
      }
    }
  }
  handlecarscolision(index){
    if (index===1) {
      if (cars[index-1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX+=100
        } else {
          player.positionX-=100
        }
        if (player.life>0) {
          player.life-=185/4
        }
        player.update()
      }
    }
    if (index===2) {
      if (cars[index-1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX+=100
        } else {
          player.positionX-=100
        }
        if (player.life>0) {
          player.life-=185/4
        }
        player.update()
      }
    }
  }
 
  showlife(){
    push()
    image(lifeimg,width/2-130,height-player.positionY-280,20,20)
    fill('white')
    rect(width/2-100,height-player.positionY-280,185,20)
    fill('red')
    rect(width/2-100,height-player.positionY-280,player.life,20)
  }
  showfuell(){
    push()
    image(fuelimg,width/2-130,height-player.positionY-250,20,20)
    fill('white')
    rect(width/2-100,height-player.positionY-250,185,20)
    fill('blue')
    rect(width/2-100,height-player.positionY-250,player.fuel,20)
  }

  showrank(){
    swal({
      title:`incrivel${'\n'}${player.rank}ºlugar`,
      text:'parabens',
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
       imageSize: "100x100", confirmButtonText: "Ok"
    })
  }

  GameOver(){
    swal({
      title:`game Over`,
      text:'Game Over cara',
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
       imageSize: "100x100", confirmButtonText: "Ok"
    })
  }
}
