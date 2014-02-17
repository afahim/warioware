window.onload = function() {
   $("#canvas").height($(window).height());
   $("#canvas").width($(window).width());
   init();
};

$( window ).resize(function() {
   $("#canvas").height($(window).height());
   $("#canvas").width($(window).width());
});

function init() {
   var   b2Vec2 = Box2D.Common.Math.b2Vec2
   ,  b2AABB = Box2D.Collision.b2AABB
   ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
   ,  b2Body = Box2D.Dynamics.b2Body
   ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
   ,  b2Fixture = Box2D.Dynamics.b2Fixture
   ,  b2World = Box2D.Dynamics.b2World
   ,  b2MassData = Box2D.Collision.Shapes.b2MassData
   ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
   ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
   ,  b2DebugDraw = Box2D.Dynamics.b2DebugDraw
   ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
   ,  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
   ,  b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
   ;
   
   b2FixtureDef.prototype.density = 1;
   b2FixtureDef.prototype.friction = .5;
   b2FixtureDef.prototype.restitution = .2;

   var world = new b2World(new b2Vec2(0, 12), true);
   
   var fixDef = new b2FixtureDef;

   var bodyDef = new b2BodyDef;
   
   //create ground
   bodyDef.type = b2Body.b2_staticBody;
   fixDef.shape = new b2PolygonShape;
   fixDef.shape.SetAsBox(30, 2);
   bodyDef.position.Set(-12, 400 / 30 + 9.8);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(55, 400 / 30 + 9.8);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(10, -1.8);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   fixDef.shape.SetAsBox(2, 14);
   bodyDef.position.Set(-1.8, 13);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(40.6, 13);
   world.CreateBody(bodyDef).CreateFixture(fixDef);


   /////////////////////////////////////
   // Custom code //////////////////////

   function createBox(world, x, y, width, height) {
      var fixDef = new b2FixtureDef;
      fixDef.density = 5.0;
      fixDef.friction = 1.0;
      fixDef.restitution = .5;

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

   function createBall(world, x, y, r) {
      var fixDef = new b2FixtureDef;
      fixDef.density = 3.0;
      fixDef.friction = 2.0;
      fixDef.restitution = .2;

      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.position.x = x;
      bodyDef.position.y = y;

      fixDef.shape = new b2CircleShape(r);

      var b = world.CreateBody(bodyDef);
      b.CreateFixture(fixDef);
      return b;
   }

   function buildPrismaticJoint(world, bodyA, bodyB, anchorA, axis) {
      var jointDef = new b2PrismaticJointDef();
      jointDef.Initialize(bodyA, bodyB, anchorA, axis);
      jointDef.collideConnected = false;
      jointDef.lowerTranslation = 0.0;
      jointDef.upperTranslation = 3;
      jointDef.enableLimit = true;
      jointDef.maxMotorForce = 400.0;
      jointDef.motorSpeed = -.5;
      jointDef.enableMotor = true;
      return world.CreateJoint(jointDef);
   }

   var chassis = createBox(world, 15, 10, 1, .4);
   var backWheel = createBall(world, 13.8, 11, .4);
   var frontWheel = createBall(world, 16.2, 11, .4);
   backWheel.angularVelocity = 0;
   frontWheel.angularVelocity = 0;

   var backShock = createBox(world, 14, 10.5, .4, .1);
   var frontShock = createBox(world, 16, 10.5, .4, .1);

   // Connecting the chassis to its shocks
   backShockJoint = buildPrismaticJoint(world, chassis,
    backShock, new b2Vec2(14,10.5), new b2Vec2(0, -1));
   frontShockJoint = buildPrismaticJoint(world, chassis,
      frontShock, new b2Vec2(16, 10.5), new b2Vec2(0,-1));

   // Creating the revolute joints between wheels and chassis
   var backJoint = new b2RevoluteJointDef;
   backJoint.Initialize(backShock, backWheel, backWheel.GetWorldCenter());
   world.CreateJoint(backJoint);
   var frontJoint = new b2RevoluteJointDef;
   frontJoint.Initialize(frontShock, frontWheel, frontWheel.GetWorldCenter());
   world.CreateJoint(frontJoint);


   var fixTri = new b2FixtureDef;
   fixTri.shape = new b2PolygonShape;
   fixTri.density = 1.0;
   fixTri.friction = 2.0;
   fixTri.restitution = .5;

   fixTri.shape.SetAsArray([
     new b2Vec2(-9, 0),
     new b2Vec2(0, -3),
     new b2Vec2(0, 0)],3
     );

   var bodyTri = new b2BodyDef;
   bodyTri.type = b2Body.b2_staticBody;    
   bodyTri.position.Set(18, 21.2);
   world.CreateBody(bodyTri).CreateFixture(fixTri);


   // // End custom code //////////////////
   ////////////////////////////////////////

   //create some objects


   for (var i = 0; i < 1; i++) {
      if (Math.random() > .5) {
         createBall(world, Math.random()*15, Math.random()*15, Math.random()+.1);
      }
      else {
         createBox(world, Math.random()*15, Math.random()*15, Math.random()+.1, Math.random()+.1)
      }
   }
   
   //setup debug draw
   var debugDraw = new b2DebugDraw();
   debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
   debugDraw.SetDrawScale(30.0);
   debugDraw.SetFillAlpha(0.5);
   debugDraw.SetLineThickness(1.0);
   debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
   world.SetDebugDraw(debugDraw);
   
   window.setInterval(update, 1000 / 60);
   
   //keyboard

   $('#gas-pedal').mousedown(function(){
      console.log("gaspedal");
      frontWheel.angularVelocity += .8;
      backWheel.angularVelocity += .8; 
      if (frontWheel.angularVelocity < 0) {
         frontWheel.angularVelocity /= 4;
      }
      if (backWheel.angularVelocity < 0) {
         backWheel.angularVelocity /= 4;
      }
      if (frontWheel.angularVelocity > 40) {
         frontWheel.angularVelocity = 40;
      }
      if (backWheel.angularVelocity > 40) {
         backWheel.angularVelocity = 40;
      }
      frontWheel.SetAngularVelocity(frontWheel.angularVelocity);
      backWheel.SetAngularVelocity(backWheel.angularVelocity);
      console.log("d");
   });

   function keyDownHandler(event) {
      var keyPressed = String.fromCharCode(event.keyCode);

      if (keyPressed == "A") {
         frontWheel.angularVelocity -= .8;
         backWheel.angularVelocity -= .8;
         if (frontWheel.angularVelocity > 0) {
            frontWheel.angularVelocity /= 4;
         }
         if (backWheel.angularVelocity > 0) {
            backWheel.angularVelocity /= 4;
         }
         if (frontWheel.angularVelocity < -40) {
            frontWheel.angularVelocity = -40;
         }
         if (backWheel.angularVelocity < -40) {
            backWheel.angularVelocity = -40;
         }
         frontWheel.SetAngularVelocity(frontWheel.angularVelocity);
         backWheel.SetAngularVelocity(backWheel.angularVelocity);
      }

      else if (keyPressed == "D") {
         frontWheel.angularVelocity += .8;
         backWheel.angularVelocity += .8; 
         if (frontWheel.angularVelocity < 0) {
            frontWheel.angularVelocity /= 4;
         }
         if (backWheel.angularVelocity < 0) {
            backWheel.angularVelocity /= 4;
         }
         if (frontWheel.angularVelocity > 40) {
            frontWheel.angularVelocity = 40;
         }
         if (backWheel.angularVelocity > 40) {
            backWheel.angularVelocity = 40;
         }
         frontWheel.SetAngularVelocity(frontWheel.angularVelocity);
         backWheel.SetAngularVelocity(backWheel.angularVelocity);
         console.log("d");
      }
   }

   document.addEventListener("keydown", keyDownHandler, true);

   //mouse
   
   var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
   var canvasPosition = getElementPosition(document.getElementById("canvas"));

   document.addEventListener("mousedown", function(e) {
      isMouseDown = true;
      handleMouseMove(e);
      document.addEventListener("mousemove", handleMouseMove, true);
   }, true);
   
   document.addEventListener("mouseup", function() {
      document.removeEventListener("mousemove", handleMouseMove, true);
      isMouseDown = false;
      mouseX = undefined;
      mouseY = undefined;
   }, true);
   
   function handleMouseMove(e) {
      mouseX = (e.clientX - canvasPosition.x) / 30;
      mouseY = (e.clientY - canvasPosition.y) / 30;
   };
   
   function getBodyAtMouse() {
      mousePVec = new b2Vec2(mouseX, mouseY);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
      aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
      
      // Query the world for overlapping shapes.

      selectedBody = null;
      world.QueryAABB(getBodyCB, aabb);
      return selectedBody;
   }

   function getBodyCB(fixture) {
      if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
            selectedBody = fixture.GetBody();
            return false;
         }
      }
      return true;
   }
   
   //update
   
   function update() {

      if(isMouseDown && (!mouseJoint)) {
         var body = getBodyAtMouse();
         if(body) {
            var md = new b2MouseJointDef();
            md.bodyA = world.GetGroundBody();
            md.bodyB = body;
            md.target.Set(mouseX, mouseY);
            md.collideConnected = true;
            md.maxForce = 300.0 * body.GetMass();
            mouseJoint = world.CreateJoint(md);
            body.SetAwake(true);
         }
      }
      
      if(mouseJoint) {
         if(isMouseDown) {
            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
         } else {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
         }
      }

      world.Step(1 / 60, 10, 10);
      world.DrawDebugData();
      world.ClearForces();
   };
   
   //helpers
   
   //http://js-tut.aardon.de/js-tut/tutorial/position.html
   function getElementPosition(element) {
      var elem=element, tagname="", x=0, y=0;

      while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
         y += elem.offsetTop;
         x += elem.offsetLeft;
         tagname = elem.tagName.toUpperCase();

         if(tagname == "BODY")
            elem=0;

         if(typeof(elem) == "object") {
            if(typeof(elem.offsetParent) == "object")
               elem = elem.offsetParent;
         }
      }

      return {x: x, y: y};
   }


};
