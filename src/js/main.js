var game = (function(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    //1. Create the player object
    // Define all argument that will be used by fillRect()
    var player = {
      x:0,
      y:475,
      h: 25,
      w: 25,
      fill: '#fff',
      //1. Add a default direction for player movement.
      dir: 'right',
      //1. Add a speed property to the player this is the number of pixels 
      //the player will move each frame
      speed: 5
    }

    //1. Define an enemy spawn
    var spawn = {
    x: 50,
    y: 0,
    h: 10,
    w: 10,
    fill: '#ff0',
    speed: 5
    }

    //1. Initialize an Object of spawns
    var spawns = {}

    //2. Initialize a variable for launching spawns.
    var spawner = null;

    //1. Add the animation frames to a variable
    //that we can kill later
    var animation  = null;

    //2. Track the state of game-over
    var gameOver = false;

    //1. Create a variable to hold the score
    var score = 0;

    function launchSpawns(){
        //3. Create a new enemy spawn every 400 ms
        spawner = setInterval(()=>{
          //4. Use psuedo-random strings to name the new spawns
          var text = "";
          var possible = "abcdefghijklmnopqrstuvwxyz";
    
          for (var i = 0; i < 10; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
    
          //5. Add the new spawn to the Object of Spawns
          spawns[text] = {
            x:Math.floor(Math.random()*this.canvas.width),
            y:spawn.y,
            h:spawn.h,
            w:spawn.w,
            fill:spawn.fill,
            speed:spawn.speed,
          }
    
        },400);
      }
  //6. Move all spawns
 

    function moveSpawns(){

    //7. Loop through the Object of spawns
    //and move each one individually.
    //This will look a lot like movePlayer()
    if(Object.keys(spawns).length>0){
      for(let spawn in spawns){

        //8. Only move the spawn, if the spawn has not 
        //moved off of the screen.
        if(spawns[spawn].y<=canvas.height){

          ctx.fillStyle = spawns[spawn].fill;

          ctx.save();

          ctx.clearRect(
            spawns[spawn].x-1,
            spawns[spawn].y-spawns[spawn].speed,
            spawns[spawn].w+2,
            spawns[spawn].h+2
          );

          ctx.fillRect(
            spawns[spawn].x,
            spawns[spawn].y = (spawns[spawn].y+spawns[spawn].speed),
            spawns[spawn].w,
            spawns[spawn].h
          );

          ctx.restore();

            //3. When each spawn moves detect if that spawn shares common pixels
            //with the player. If so this is a collision.
            //@see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
            if (
                player.x < spawns[spawn].x + spawns[spawn].w &&
                spawns[spawn].x > player.x && spawns[spawn].x < (player.x + player.w) &&
                player.y < spawns[spawn].y + spawns[spawn].h &&
                player.y + player.h > spawns[spawn].y
              ){
                //4. If there is a collision set gameOver to true
                gameOver = true;
                //5. ...kill the animation frames
                cancelAnimationFrame(animation);
                //6. ...kill the spawner
                clearInterval(spawner);
              }
          

        }else{
            //2. Increment the score when any time
            //an enemy sprite move off screen
            score = score + 10;
            //3. Write the score to a separate div
            document.getElementById('score').innerHTML = score;
          //9. Delete the spawn from the Object of spawns if 
          // that spawn has moved off of the screen.
          delete spawns[spawn];
        }
      }
    }

  }
  
    
      //2. Draw the player to the canvas
    //   player: function(){
        function movePlayer(){
        ctx.fillStyle=player.fill;

        if(player.dir === 'right'){
  
        //1. Define how many pixels the player
        // should move each frame (i.e. speed)
        ctx.clearRect(
          player.x-player.speed,
          player.y-1,
          player.w+2,
          player.h+2
        );
  
        //3. Change player.x++ to player.x = (player.x + player.speed)
        ctx.fillRect(
            player.x = (player.x + player.speed),
            player.y,
            player.w,
            player.h
          );

        //3. Change the player direction when the player touches the edge 
        //of the canvas.
        if((player.x + player.w) >= canvas.width){
          player.dir = 'left';
        }

      }else{

        //4. Change player.x+1 to player.x+player.speed
        ctx.clearRect(
            player.x+player.speed,
            player.y-1,
            player.w+2,
            player.h+2
          );

        //5. Change player.x-- to player.x = (player.x - player.speed),
        ctx.fillRect(
            player.x = (player.x - player.speed),
            player.y,
            player.w,
            player.h
            );  

        //5. Change the player direction when the player touches the edge 
        //of the canvas.
        if(player.x <= 0){
          player.dir = 'right';
        }
      }
    }
    function animate(){
        movePlayer();
        moveSpawns();
        if(gameOver===false){
          animation = window.requestAnimationFrame(animate.bind(animation));
        }
      }
    
      return {
    
        changeDirection: function(){
          if(player.dir === 'left'){
            player.dir = 'right';
          }else if(player.dir === 'right'){
            player.dir = 'left';
          }
        },
    
        init: function(){
          canvas.height = 600;
          canvas.width = 800;
    
          launchSpawns();
          animate();
        }
      }
    })();
        
  
  game.init();
  
  //2. Add a listener to allow the  user to change the direction
//of the player sprite
window.addEventListener('keyup', function(){
    game.changeDirection();
  });

