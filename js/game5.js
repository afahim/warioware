jumpScroller = new Game();

jumpScroller.startGame = function () {
	var that = this;


	///////////
	// SETUP //
	///////////


	// Creating game world
	that.world = new b2World(new b2Vec2(0, 13), true);

	// Setting up canvas and graphics and music
	var scale = 5;
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var box2dWidth = canvas.width/scale;
	var box2dHeight = canvas.height/scale;
	var context = canvas.getContext("2d");

	var listOfElements = []; // This will contain all B2CanvasElements

	var gameOver = false;

	that.music = document.getElementById("birdSong");

	that.music.volume = .3;

	that.music.play();


	///////////
	// WALLS //
	///////////
	

	// Adding the walls to the world. This process is semi-randomized.
	var numberOfWalls = 2;
	var listOfWallCanvasInfo = [];
	var wallWidth = box2dHeight/16;
	var openingSize = box2dHeight/6; // This is actually half the opening size
	var startingZoneSize = box2dWidth/5;
	for (var i = 0; i < numberOfWalls; i++) {
		var opening = box2dHeight/4 + (Math.random()*box2dHeight/2);

		// function to pass to box2d graphics for drawing the pipe

		var topPipeBody = createStaticBox(that.world,
			(box2dWidth/(numberOfWalls+1))*(i+1) + startingZoneSize,
			(opening - box2dHeight - openingSize),
			wallWidth,
			box2dHeight)
		var topPipe = new B2CanvasElement(topPipeBody, scale);
		listOfElements.push(topPipe);

		// now we push the top left, top right, width, and height
		// in canvas coordintes so we can draw it later
		listOfWallCanvasInfo.push([(topPipe.x() - wallWidth)*scale,
								   (topPipe.y() - box2dHeight)*scale,
								    wallWidth*2*scale,
								   	box2dHeight*2*scale]);

		var botPipeBody = createStaticBox(that.world,
			(box2dWidth/(numberOfWalls+1))*(i+1) + startingZoneSize,
			(opening + box2dHeight + openingSize),
			wallWidth,
			box2dHeight)
		var botPipe = new B2CanvasElement(botPipeBody, scale);
		botPipe.geometry = "box";
		listOfElements.push(botPipe);

		listOfWallCanvasInfo.push([(botPipe.x() - wallWidth)*scale,
						   		   (botPipe.y() - box2dHeight)*scale,
						 		    wallWidth*2*scale,
						  		    box2dHeight*2*scale]);
	}

	//////////////
	// GRAPHICS //
	//////////////

	drawWalls = function() {
		for (var i = 0; i < listOfWallCanvasInfo.length; i++) {
			var randomColor = Math.random();
			var color;
			if (randomColor < .33) {
				color = '#0000ff';
			}
			else if (randomColor < .66) {
				color = '#00ff00';
			}
			else {
				color = '#ff0000';
			}
			context.save();
		    context.fillStyle = '#000000';
		    context.shadowColor = color;
      		context.shadowBlur = 100;
			context.fillRect(listOfWallCanvasInfo[i][0],
						 	 listOfWallCanvasInfo[i][1],
						 	 listOfWallCanvasInfo[i][2],
						 	 listOfWallCanvasInfo[i][3]);
			context.fill();
			context.stroke();
			context.restore();
		}
	}

	////////////
	// PLAYER //
	////////////

	var playerSpeed = 1600;

	// Adding the player to the world.
	var playerBody = createBall(that.world, 0, box2dHeight/2, 3, 3);
	playerBody.name = "player";
	var player = new B2CanvasElement(playerBody, scale, "./images/bird.png");
	listOfElements.push(player);

	// Pushing the player to the right at the beginning.
	playerBody.ApplyImpulse(new b2Vec2(playerSpeed, 0),
								playerBody.GetWorldCenter());

	// makes it so an upward impulse on the player is activated
	var playerControl = function() {
		if (gameOver === false) {
			document.getElementById("birdFlap").play();
			var body = player.b2dBody;

			// Gets rid of any veritcal velocity.
			var bodyVelocity = body.GetLinearVelocity();
			body.SetLinearVelocity(new b2Vec2(bodyVelocity.x, 0));

	      	// Applies an impulse at the center of the body, up.
	      	body.ApplyImpulse(new b2Vec2(0, -2500), body.GetWorldCenter());

	      	// This part gives some life to the character
	      	// by rotating him when he 'flaps'
	      	if (Math.random() < .25) {
	      		body.SetAngularVelocity(1);
	      	}
	      	else if (Math.random() < .5) {
	      		body.SetAngularVelocity(.5);
	      	}
	      	else if (Math.random() < .75) {
	      		body.SetAngularVelocity(-.5);
	      	}
	      	else {
	      		body.SetAngularVelocity(-1);
	      	}
	    }
	}

	// keyboard controls, by pressing d
	function keyDownHandler(event) {
		var keyPressed = String.fromCharCode(event.keyCode);

		if (keyPressed == "D") {
			playerControl();
		}
	}
	document.addEventListener("keydown", keyDownHandler, true);

    var flag = false;
   	$("#canvas").bind('touchstart click', function() {
      if (!flag) {
         flag = true;
         setTimeout(function(){ flag = false; }, 30);
         playerControl();
      }
   	});



	//////////////////////////////////
	// GAME LOOP AND WIN CONDITIONS //
	//////////////////////////////////

	// Loss condition due to collision
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = function(contact) {
    	cBodyA = contact.GetFixtureA().GetBody().name; // First body
    	cBodyB = contact.GetFixtureB().GetBody().name; // Second body
    	if ((cBodyA === "player") || (cBodyB === "player")) {
    		document.getElementById("birdCollide").play()
    		gameOver = true;
    		that.wonOrLost = false;
    	}
    }
    that.world.SetContactListener(listener);

	// Game loop and game loop variables
	that.wonOrLost = false;
	that.endGameCalledAlready = false;
	var frame = 0;
	var countdown = 3;
    var countdownPeriod = 100; // Higher number, slower countdown
    var update = function() {

    	// Quit the game if it's over.
    	if (gameOver === true) {
    		that.endGame();
    	}

    	// This if statement manages the countdown at the beginning of the game
    	if ((frame % countdownPeriod === 0) && (countdown >= 0)) {
    		updateBox2dGame(that.world, canvas, context, listOfElements);
    		drawWalls();

      		countdown--;
      	}

  		// This is the main update function which steps the world and draws   
      	if (countdown === -1) {
      		updateBox2dGame(that.world, canvas, context, listOfElements);
      		// Drawing the walls using our canvas info about them
      		drawWalls();
      		
      	}


      	// Checks if the player has gone off the right of the screen and 
      	// sends a "win" message if so!
      	if (player.x() > box2dWidth) {
      		gameOver = true;
      		that.wonOrLost = true;
      	}

      	// If the player has moved out of the bounds of the ceiling or floor,
      	// he or she loses.
      	if ((player.y() > box2dHeight) || (player.y() < 0)) {
      		gameOver = true;
      		that.wonOrLost = false;
      	}

      	frame++; 
    }

    that.stopid = setInterval(update, 4);

}

jumpScroller.endGame = function () {
	var that = this;

  	if (that.endGameCalledAlready === false) {

  		stopGame = function() {
  			clearInterval(that.stopid)
  			that.world = null;
  			that.music.pause();
			that.music.currentTime = 0;
  		}

  		setTimeout(stopGame, 2000);
  		gameFinished(that.wonOrLost);
  		that.endGameCalledAlready = true;
  	}

}