/* ========================================================================
* Desert Jump v0.2
* https://github.com/afahim/warioware/
* ========================================================================
* Copyright 2014 Techbridgeworld, Inc.
* Developed for 15-239 (http://www.cs.cmu.edu/~./239/about/)
* ======================================================================== */


desertJump = new Game();

desertJump.startGame = function() {
   ////////////////////////
   // Creating the world //
   ////////////////////////
   var that = this;

   var world = new b2World(new b2Vec2(0, 12), true);

   // Creating the walls
   var leftFloor = createStaticBox(world, -12, 23, 30, 4);
   var rightFloor = createStaticBox(world, 30, 23, 8, 4);
   var stoppingRamp = createStaticTriangle(world, [-4,0], [0, -3], [0,0], [38, 19]);
   stoppingRamp.name = "stoppingRamp";
   rightFloor.name = "rightFloor"; // We name this one because we use it
                                  // in the game logic later.
                                  // The other bodies which do not have .name
                                  // return undefined when queried for it.
   var ceiling = createStaticBox(world, 10, -1.8, 30, 2);
   var leftWall = createStaticBox(world, -1.8, 13, 2, 14);
   leftWall.name = "leftFloor";


   // The object is centered at (18, 19), and the other arguments are points
   // relative to the center of the triangle.
   var ramp = createStaticTriangle(world, [-9, 0], [0, -3], [0,0], [18, 19]);
   ramp.name = "ramp";

   // car is a Car object which containts
   // .chassis, .backShock, .frontShock,
   // .backWheel, and .frontWheel,
   // which are all b2Bodies.
   var car = makeCar(world, 15, 10);

   // controls for car
   function keyDownHandler(event) {
      var keyPressed = String.fromCharCode(event.keyCode);

      if (keyPressed == "D") {
         car.frontWheel.angularVelocity += .8;
         car.backWheel.angularVelocity += .8; 
         if (car.frontWheel.angularVelocity > 40) {
            car.frontWheel.angularVelocity = 40;
         }
         if (car.backWheel.angularVelocity > 40) {
            car.backWheel.angularVelocity = 40;
         }
         car.frontWheel.SetAngularVelocity(car.frontWheel.angularVelocity);
         car.backWheel.SetAngularVelocity(car.backWheel.angularVelocity);
      }
   }
   document.addEventListener("keydown", keyDownHandler, true);


   $('#gas-pedal').mousedown(function(){
      car.frontWheel.angularVelocity += 6;
      car.backWheel.angularVelocity += 6; 
      if (car.frontWheel.angularVelocity < 0) {
         car.frontWheel.angularVelocity /= 4;
      }
      if (car.backWheel.angularVelocity < 0) {
         car.backWheel.angularVelocity /= 4;
      }
      if (car.frontWheel.angularVelocity > 40) {
         car.frontWheel.angularVelocity = 40;
      }
      if (car.backWheel.angularVelocity > 40) {
         car.backWheel.angularVelocity = 40;
      }
      car.frontWheel.SetAngularVelocity(car.frontWheel.angularVelocity * 4);
      car.backWheel.SetAngularVelocity(car.backWheel.angularVelocity * 4);
   });



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
   world.SetDebugDraw(debugDraw);


   ////////////////////////////////////
   // Win or loss condition checking //
   ////////////////////////////////////

   var gameOver = false;

   function winGame() { 
      if (gameOver == false) {
         gameOver = true; // The game condition can no longer change
         that.gameWonOrLost = false; // returns a win to the framework
         that.endGame(world);
      }
   }

   function loseGame() {
      if (gameOver == false) {
         gameOver = true; 
         that.gameWonOrLost = false; // returns a loss to the framework
         that.endGame(world);
      }
   }

   function bodiesTouching(bodyA, bodyB, name1, name2) {
      if (((bodyA == name1) && (bodyB == name2)) ||
         ((bodyA == name2) && (bodyB == name1))) {
         return true;
      }
      return false;
   }

   // Setting up a contact listener, which automatically initiates
   // events which occur due to collisions between fixtures.
   var listener = new Box2D.Dynamics.b2ContactListener;
   listener.BeginContact = function(contact) {
      cBodyA = contact.GetFixtureA().GetBody().name; // First body
      cBodyB = contact.GetFixtureB().GetBody().name; // Second body
      if (gameOver == false) {
         // If the back wheels have connected with right side
         if ((bodiesTouching(cBodyA, cBodyB, "backWheel", "rightFloor")) ||
             (bodiesTouching(cBodyA, cBodyB, "backWheel", "stoppingRamp"))) {
            setTimeout(function() {winGame()}, 2000);
         }
         // If the chassis connects with any static body
         else if ((bodiesTouching(cBodyA, cBodyB, "chassis", "rightFloor")) ||
                  (bodiesTouching(cBodyA, cBodyB, "chassis", "stoppingRamp")) ||
                  (bodiesTouching(cBodyA, cBodyB, "chassis", "ramp"))) {
            loseGame();
         }
      }
   }

   world.SetContactListener(listener);

   // We call this function at set intervals to test game conditions.
   function update() {

      // Tests to see if the player has fallen down the hole.
      // If they have, the game is over and the player loses.
      if (car.chassis.m_sweep.c.y > 25) { // If the car is too low
         loseGame();
      }

      world.Step(1 / 60, 10, 10);
      world.DrawDebugData();
      world.ClearForces();
   }

   window.setInterval(update, 1000 / 60);
}

desertJump.endGame = function(world) {
   gameFinished(this.gameWonOrLost);
   world = null
}