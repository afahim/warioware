target = new Game();

target.difficulty = 0;

target.startGame = function() {

	///////////
	// SETUP //
	///////////
	var that = this;

	// Canvas setup
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var context = canvas.getContext("2d");

	// Audio setup
	var newHTML = '<div id="target">' +
					'<audio id="explodeSound" src="games/target/audio/explode.wav"></audio>' +
				  '</div>';
	$('body').prepend(newHTML);

	that.explodeSound = document.getElementById("explodeSound");

	// Gravity (difficulty variable)
	var gravity = 0.0;

	// Target setup
	that.targetList = [];
	var targetRadius = canvas.width/16.0;

	// Setup for targets and target list
	// Also begins setup for different difficulties
	function Target(x, y, radius, dx, dy) {
		var that = this;
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.coordinates = {x: x, y: y};
		this.dx = dx;
		this.dy = dy;

		// Each target in the target list will have update and draw called
		this.update = function() {
			this.dy += gravity;
			this.x += this.dx;
			this.y += this.dy;
			this.coordinates.x += this.dx;
			this.coordinates.y += this.dy;
		};

		this.draw = function() {
		 	context.save();
      		context.beginPath();
     		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
      		context.fillStyle = 'orange';
      		context.fill();
      		context.lineWidth = 5;
      		context.strokeStyle = '#003300';
      		context.stroke();
      		context.beginPath();
     		context.arc(this.x, this.y, this.radius/2, 0, 2*Math.PI, false);
      		context.fillStyle = 'white';
      		context.fill();
      		context.lineWidth = 5;
      		context.strokeStyle = '#003300';
      		context.stroke();
	      	context.restore;
		};
	}

///////////////////////
// DIFFICULTY LEVELS //
///////////////////////

// Big target wrapper function
function makeBigTarget() {
	if (Math.random() > 0.5) {
		that.targetList.push(new Target(0,
																	canvas.height,
																	targetRadius*2,
																	3,
																	-3));
	}
	else {
		that.targetList.push(new Target(canvas.width,
																	canvas.height,
																	targetRadius*2,
																	-3,
																	-3));
	}
}


	// One in middle
	if (that.difficulty == 0) {
		that.targetList.push(new Target(canvas.width/2,
									canvas.height/2,
									targetRadius,
									0,
									0));
	}
	// One on left, goes right
	else if (that.difficulty == 1) {
		if (Math.random() > .5) {
			that.targetList.push(new Target(0,
									canvas.height/2,
									targetRadius,
									1,
									0));
		}
		// One on top, goes down
		else {
			that.targetList.push(new Target(canvas.width/2,
									0,
									targetRadius,
									0,
									1));
		}
	}
	// Two on top, go down
	else if (that.difficulty == 2) {
		if (Math.random() > .5) {

			that.targetList.push(new Target(2*canvas.width/3,
								 0,
								 targetRadius,
								 0,
								 2));
			that.targetList.push(new Target(canvas.width/3,
								 0,
								 targetRadius,
								 0,
								 1));
		}
		// Two on right, go left
		else {
			that.targetList.push(new Target(5,
								 2*canvas.height/3,
								 targetRadius,
								 1,
								 0));
			that.targetList.push(new Target(5,
								 canvas.height/3,
								 targetRadius,
								 1,
								 0));
		}
	}
	// This is the "higher than 2" difficulty setting
	else {
		if (that.difficulty > 6) {
			that.difficulty = 6;
		}
		gravity = 0.01; // Makes targets drop.
		for (i = 0; (i < that.difficulty - 2); i++) {
			that.targetList.push(
							  new Target(canvas.width/4 + Math.random()*(canvas.width/2),
													 canvas.height - 5,
													 targetRadius,
													 0,
													 -3));
		}
		if (that.difficulty == 6) {
			if (Math.random() > 0.5) {
				makeBigTarget();
			}
		}
	}

	// There's more room for the difficulties section, too! I think this can be
	// expanded a lot.

	////////////////
	// EXPLOSIONS //
	////////////////

	that.particles = [];

 	// A single explosion particle
	function Particle () {
		this.scale;
		this.x;
		this.y;
		this.radius;
		this.color;
		this.velocityX;
		this.velocityY;
		this.scaleSpeed;

		// Each particle in particles will have update and draw called
		this.update = function(ms) {
			// shrinking
			this.scale -= this.scaleSpeed * ms / 1000.0;

			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			// moving away from explosion center
			this.x += this.velocityX * ms/1000.0;
			this.y += this.velocityY * ms/1000.0;
		};

		this.draw = function() {
			// translating the 2D context to the particle coordinates
			context.save();
			context.translate(this.x, this.y);
			context.scale(this.scale, this.scale);

			// drawing a filled circle in the particle's local space
			context.beginPath();
			context.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context.closePath();

			context.fillStyle = this.color;
			context.fill();

			context.restore();
		};
	}

	function randomFloat (min, max) {
		return min + Math.random()*(max-min);
	}

	// Partially found online with small edits.
	// Creates many circles at (x,y) with a specified color
	// and moves them away from each other which they diminish in size until
	// they are no longer drawn.
	function createExplosion(x, y, color) {
		var minSize = canvas.width/50.0;
		var maxSize = canvas.width/30.0;
		var count = 10;
		var minSpeed = 100.0;
		var maxSpeed = 600.0;
		var minScaleSpeed = 1.0;
		var maxScaleSpeed = 4.0;

		for (var angle=0; angle<360; angle += Math.round(360/count)) {
			var particle = new Particle();

			particle.scale = 1.0;

			particle.x = x;
			particle.y = y;

			particle.radius = randomFloat(minSize, maxSize);

			particle.color = color;

			particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);

			var speed = randomFloat(minSpeed, maxSpeed);

			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

			that.particles.push(particle);
		}
	}

	///////////////////////////
	// CONTROLS AND HANDLERS //
	///////////////////////////

	// Distance equation
	function distanceBetweenTwoPoints(p1, p2) {
		return Math.sqrt(Math.pow((p2.x - p1.x), 2)
					   + Math.pow((p2.y - p1.y), 2));
	}

	function playerClick(mouseCoordinates) {
		for (i=0; (i < that.targetList.length); i++) {
			// if the click is inside its radius
			targetCoordinates = that.targetList[i].coordinates;
			d = distanceBetweenTwoPoints(mouseCoordinates, targetCoordinates);
			if (d < that.targetList[i].radius) {
				x = that.targetList[i].x;
				y = that.targetList[i].y;
				createExplosion(x, y, "#525252");
				createExplosion(x, y, "#FFA318");
				that.explodeSound.play();
				that.targetList.splice(i, 1); // Remove target
			}
		}
	}

	function getMousePos(evt) {
    	var rect = canvas.getBoundingClientRect();
    	return {
        	x: evt.clientX - rect.left,
        	y: evt.clientY - rect.top
      	};
    }

    var flag = false;
   	$("#canvas").bind('touchstart click', function(evt) {
      	if (!flag) {
        	flag = true;
        	setTimeout(function(){ flag = false; }, 30);
        	var mouseCoordinates = getMousePos(evt);
        	playerClick(mouseCoordinates);
      	}
   	});


   	////////////
	// UPDATE //
	////////////
	var currentFrame = 0;
	var frameDelay = 4;
	that.gameOver = false;
	that.gameStartedYet = false;
	function update() {
		// Background
		context.save();
		context.fillStyle = "#9aaaFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.restore();
		// Update and draw any targets
		for (i = 0; (i < that.targetList.length); i++) {
			var target = that.targetList[i];
			if (that.gameStartedYet) {
				that.targetList[i].update();
			}
		  that.targetList[i].draw();
		}
		// Update and draw any particles
		for (i = 0; i < that.particles.length; i++) {
			var particle = that.particles[i];
			particle.update(frameDelay);
			particle.draw();
		}

		// Check if game can start
		if (currentFrame > 300) {
			that.gameStartedYet = true;
		}

		// Win/Loss conditions
		if (that.gameOver == false) {
			for (i = 0; (i < that.targetList.length); i++) {
				var target = that.targetList[i];
				if ((target.x > canvas.width) || (target.y > canvas.height)
				 || (target.x < 0) 			  || (target.y < 0)) {
					that.winOrLoss = false;
					that.endGame();
				}
			}

			if (that.targetList.length == 0) {
				that.winOrLoss = true;
				that.endGame();
			}
		}

		currentFrame++;
	}

	that.stopUpdateID = setInterval(update, frameDelay);

}

target.endGame = function() {
	// First we clear the update interval
	// The reason we delay is to wait for the last explosion.
	var that = this;
	this.gameOver = true;
	function clearWrapper() {
		clearInterval(that.stopUpdateID);
	}
	setTimeout(clearWrapper, 1500);

	//Next we change the difficulty
	if (this.winOrLoss) {
		this.difficulty++;
	} else {
		this.difficulty--;
		if (this.difficulty < 0) {
			this.difficulty = 0;
		}
	}

	// Finally we return the win or loss
	gameFinished(this.winOrLoss);
}

gameObjectsArray.push(target);