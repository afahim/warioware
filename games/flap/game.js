flap = new Game();

flap.difficulty = 0;

flap.startGame = function () {
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
	canvas.b2color = "#9aaaFF"
	var box2dWidth = canvas.width/scale;
	var box2dHeight = canvas.height/scale;
	var context = canvas.getContext("2d");

	var listOfElements = []; // This will contain all B2CanvasElements

	var gameOver = false;

	that.music = document.getElementById("birdSong");

	that.music.volume = .3;


	///////////
	// WALLS //
	///////////
	
	// Adding the walls to the world. This process is semi-randomized.

	// This makes the game vary with difficulty by changing the number of walls
	numberOfWalls = 0;
	if (that.difficulty <= 0) {
		numberOfWalls = 2;
	}
	else {
		numberOfWalls = 3;
	}

	var listOfWallCanvasInfo = [];
	var wallWidth = box2dHeight/16;
	var openingSize = 20; // This is actually half the opening size
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

	// This section deals with the instruction animations which appear at 
	// the beginning of the game. We call drawInstructions() during the
	// countdown at the beginning of the game, swapping between the two images.
	var whichInstruction = 0;
	var instructionImg = new Image();
	instructionImg.src = "games/flap/images/pointerFinger1000.png";
	drawInstructions = function() {
		var opacity = 1.0/(whichInstruction/8.0);
		context.save();
		context.beginPath();
		context.arc(canvas.width/2, canvas.height/2, whichInstruction, 0, Math.PI*2, true);
		context.closePath();
		context.fillStyle = 'rgba(120,120,50,' + opacity + ')';
		context.fill();

		context.restore();
		context.save();
		context.drawImage(instructionImg, canvas.width/2, canvas.height/2);
		context.restore();
		whichInstruction++;
		whichInstruction = whichInstruction%150;
	}

	drawWalls = function() {
		for (var i = 0; i < listOfWallCanvasInfo.length; i++) {
			context.save();
			context.beginPath();
			context.lineWidth= "1";
			context.strokeStyle= "#000000";
		    context.fillStyle = '#FFCC00';
		    context.shadowColor = '#000000';
      		context.shadowBlur = 6;
			context.fillRect(listOfWallCanvasInfo[i][0],
						 	 listOfWallCanvasInfo[i][1],
						 	 listOfWallCanvasInfo[i][2],
						 	 listOfWallCanvasInfo[i][3]);
			context.fill();
			context.stroke();
			context.restore();
		}
	}

	// This part defines the two player images, flapUp and flapDown
	flapUp = new Image();
	flapUp.src = "games/flap/images/flapUpTest.png";
	flapDown = new Image();
	flapDown.src = "games/flap/images/flapDownTest.png";

	////////////
	// PLAYER //
	////////////

	var playerSpeed = 1600;

	// Adding the player to the world.
	var playerBody = createBall(that.world, 0, box2dHeight/2, 3, 3);
	playerBody.name = "player";
	var player = new B2CanvasElement(playerBody, scale, flapDown);
	listOfElements.push(player);

	// Pushing the player to the right at the beginning.
	playerBody.ApplyImpulse(new b2Vec2(playerSpeed, 0),
								playerBody.GetWorldCenter());

	// makes it so an upward impulse on the player is activated
	var playerControl = function() {
		if (gameOver === false) {
			document.getElementById("birdFlap").play();
			var body = player.b2dBody;

			// Changes the image for a moment
			player.image = flapUp;
			changePlayerToFlapDown = function() {
				player.image = flapDown;
			}
			setTimeout(changePlayerToFlapDown, 200);

			// Gets rid of any veritcal velocity.
			var bodyVelocity = body.GetLinearVelocity();
			body.SetLinearVelocity(new b2Vec2(bodyVelocity.x, 0));

	      	// Applies an impulse at the center of the body, up.
	      	body.ApplyImpulse(new b2Vec2(0, -2000), body.GetWorldCenter());
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
      localStorage["flap-tutorial-done"] = true;
      if (!flag) {
      	that.gameStarted = true;
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
	that.gameStarted = false;
	var frame = 0;
    var update = function() {

    	// Quit the game if it's over.
    	if (gameOver === true) {
    		that.endGame();
    	}

    	if (!that.gameStarted) {
    		drawB2Graphics(canvas, context, listOfElements);
    		drawWalls();
    		context.save();
    		context.fillStyle = 'rgba(0,0,0,0.6)';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.restore();
            if (!localStorage["flap-tutorial-done"]) {
                drawInstructions();
            }
    	}

  		// This is the main update function which steps the world and draws   
      	if (that.gameStarted) {
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

flap.endGame = function () {
  	var that = this;

  	if (that.endGameCalledAlready === false) {
  		stopGame = function() {
  			clearInterval(that.stopid)
  			that.world = null;
  			that.music.pause();
			that.music.currentTime = 0;
			context.clearRect(0, 0, canvas.width, canvas.height);
  		}

  		setTimeout(stopGame, 2000);

  		// Game difficulty goes up or down depending on whether you won or lost
  		if (that.wonOrLost) {
  			that.difficulty ++;
  		}
  		else {
  			that.difficulty --;
  		}
  		gameFinished(that.wonOrLost);
  		that.endGameCalledAlready = true;
  	}
}

gameObjectsArray.push(flap);