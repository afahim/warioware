function startGame1() {

   ////////////////////////
   // Creating the world //
   ////////////////////////

   var world = new b2World(new b2Vec2(0, 12), true);

   // Creating the walls
   var leftFloor = createStaticBox(world, -12, 23, 30, 4);
   var rightFloor = createStaticBox(world, 55, 23, 30, 4);
   rightFloor.name = "rightFloor"; // We name this one because we use it
                                  // in the game logic later.
                                  // The other bodies which do not have .name
                                  // return undefined when queried for it.
   var ceiling = createStaticBox(world, 10, -1.8, 30, 2);
   var leftWall = createStaticBox(world, -1.8, 13, 2, 14);


   // The object is centered at (18, 19), and the other arguments are points
   // relative to the center of the triangle.
   var triangle = createStaticTriange(world, [-9, 0], [0, -3], [0,0], [18, 19]);

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


   // Setting up a contact listener, which automatically initiates
   // events which occur due to collisions between fixtures.
   var gameOver = false;
   var listener = new Box2D.Dynamics.b2ContactListener;
   listener.BeginContact = function(contact) {
      cBodyA = contact.GetFixtureA().GetBody().name; // First body
      cBodyB = contact.GetFixtureB().GetBody().name; // Second body
      if (gameOver == false) {
         // If the front or back wheels have connected with right floor
         if (((cBodyA == "backWheel") && (cBodyB == "rightFloor")) ||
             ((cBodyB == "backWheel") && (cBodyA == "rightFloor"))) {
            gameFinished(true); // The game ends and you win.
            gameOver = true;
            endGame1(world);
         }
         // If the chassis connects with the right floor
         else if (((cBodyA == "chassis") && (cBodyB == "rightFloor"))  ||
                  ((cBodyB == "chassis") && (cBodyA == "rightFloor"))) {
            gameFinished(false); // The game ends and you lose.
            gameOver = true; // The game condition can no longer change.
            endGame1(world);
         }
      }
   }

   world.SetContactListener(listener);

   // We call this function at set intervals to test game conditions.
   function update() {

      // Tests to see if the player has fallen down the hole.
      // If they have, the game is over and the player loses.
      if (car.chassis.m_sweep.c.y > 25) {
         if (gameOver == false) {
            gameFinished(false); // Lose the game
            gameOver = true;
            endGame1(world);
         }
      }

      world.Step(1 / 60, 10, 10);
      world.DrawDebugData();
      world.ClearForces();
   }

   window.setInterval(update, 1000 / 60);
}

// For now we need to pass endGame1 world to avoid using a global.
function endGame1(world) {
   world = null
}