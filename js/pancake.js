pancakeFlip = new Game()

pancakeFlip.startGame = function() {

	var createPancake = function (world, x, y, width, height) {
		var fixDef = new b2FixtureDef;
	    fixDef.density = 2.0;
	    fixDef.friction = 0.0
	    fixDef.restitution = 0;

	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_dynamicBody;
	    bodyDef.position.x = x;
	    bodyDef.position.y = y;

	    fixDef.shape = new b2PolygonShape;
	    fixDef.shape.SetAsBox(width, height);

	    var b = world.CreateBody(bodyDef);
	    b.CreateFixture(fixDef);
	    return b;
	}

	var that = this;

	/////////////////////////////
	// Creating the box2dworld //
	/////////////////////////////

	that.world = new b2World(new b2Vec2(0, 12), true);

	var windowWidth = 36;
	var windowHeight = 20;

	var pancake = createPancake(that.world, windowWidth/2, windowHeight/2, 4, .2);
	var pancakeAxis =
		createBox(that.world, windowWidth/2, windowHeight/2, .2, .2);
	var pan = createBox(that.world, windowWidth/2, 3*windowHeight/4, 5, .5);


	// Creating a joint for the pancake to rotate around.
	var pancakeRotJoint = new b2RevoluteJointDef;
    pancakeRotJoint.Initialize(pancake, pancakeAxis, pancake.GetWorldCenter());
    pancakeRotJoint.enableMotor = true;
    pancakeRotJoint.maxMotorTorque = 50;
    pancakeRotJoint.motorSpeed = 50;
   	that.world.CreateJoint(pancakeRotJoint);

   	// Attaching the pancake to a translational axis with the pan
   	var verticalPancakeLine = new b2PrismaticJointDef();
    verticalPancakeLine.Initialize(pan, pancakeAxis, pan.GetWorldCenter(), new b2Vec2(0, -1));
    verticalPancakeLine.collideConnected = false;
    verticalPancakeLine.lowerTranslation = 0.0;
    verticalPancakeLine.upperTranslation = 0.0;
    verticalPancakeLine.enableLimit = false;
    verticalPancakeLine.maxMotorForce = 0;
    verticalPancakeLine.motorSpeed = 0;
    verticalPancakeLine.enableMotor = true;
    that.world.CreateJoint(verticalPancakeLine);

   	// Creating the floor, which is not going to be "shown" in the final version
   	var floor = createStaticBox(that.world, windowWidth/2, windowHeight, windowWidth, .2);

   	//////////////
   	// Keyboard //
   	//////////////

   	function keyDownHandler(event) {
      var keyPressed = String.fromCharCode(event.keyCode);

      if (keyPressed == "D") {
         pancake.ApplyImpulse(new b2Vec2(0, -100), pancake.GetWorldCenter());
         console.log("pressed d");
      }
   }
   document.addEventListener("keydown", keyDownHandler, true);

	//////////////
	// Graphics //
	//////////////

    //setup debug draw
    // This is the temporary graphics section.
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    that.world.SetDebugDraw(debugDraw);

    ////////////
    // Update //
    ////////////

    function update() {
      	that.world.Step(1 / 60, 10, 10);
      	that.world.DrawDebugData();
      	that.world.ClearForces();
    }

    that.updateid = window.setInterval(update, 1000 / 60);
}

pancakeFlip.endGame = function() {
	that.world = null
	window.clearInterval(that.updateid);
}