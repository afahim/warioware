/* ========================================================================
* Warioware: box2dwebcustomlib.js v0.2
* https://github.com/afahim/warioware/
* ========================================================================
* Copyright 2014 Techbridgeworld, Inc.
* Developed for 15-239 (http://www.cs.cmu.edu/~./239/about/)
* ======================================================================== 
*
*These are functions are currently geared towards making the dessert jump game
*
*/

// Sets up variable use for later.
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
    ,  b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
    ;

// Takes a world, x, y, w, and h, and creates a
// dynamic box at (x,y) with width w and height h.
// Returns the box's body.
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

// Takes a world, x, y, and r, and creates 
// a dynamic ball at (x, y) with radius r.
// Returns the ball's body.
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

// Takes a world, two bodies, an anchor and an axis.
// The anchor and axis are both b2vec2s, the first of which
// should be close to the anchor object and the second of which
// is the translational axis relative to the starting position.
// Returns the joint.
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

// Takes world, x, y, width, and height,
// Creates a box at (x,y) with width and height specified,
// returns the body of the static box.
function createStaticBox(world, x, y, width, height) {
    var fixDef = new b2FixtureDef;
    fixDef.density = 5.0;
    fixDef.friction = 1.0;
    fixDef.restitution = .5;

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width, height);

    var b = world.CreateBody(bodyDef);
    b.CreateFixture(fixDef);
    return b;
}

// Creating the car
// Takes a world, x, y, and returns a car object
// comprised of .chassis, .backShock, .frontShock,
// .backWheel, .frontWheel
function makeCar(world, x, y) {

    // Creating body and wheels
    var chassis = createBox(world, x, y, 1, .4);
    chassis.name = "chassis";
    var backWheel = createBall(world, x - 1.2, y + 1, .4);
    backWheel.name = "backWheel"; 
    var frontWheel = createBall(world, x + 1.2, y + 1, .4);
    frontWheel.name = "frontWheel";
    backWheel.angularVelocity = 0;
    frontWheel.angularVelocity = 0;

    // Creating and attaching the shocks
    var backShock = createBox(world, x - 1, y + .5, .4, .1);
    var frontShock = createBox(world, x + 1, y + .5, .4, .1);

    var backShockJoint = buildPrismaticJoint(world, chassis,
        backShock, new b2Vec2(x - 1, y + .5), new b2Vec2(0, -1));
    var frontShockJoint = buildPrismaticJoint(world, chassis,
        frontShock, new b2Vec2(x + 1, y + .5), new b2Vec2(0, -1));

    // Attaching the wheels
    var backJoint = new b2RevoluteJointDef;
    backJoint.Initialize(backShock, backWheel, backWheel.GetWorldCenter());
    world.CreateJoint(backJoint);
    var frontJoint = new b2RevoluteJointDef;
    frontJoint.Initialize(frontShock, frontWheel, frontWheel.GetWorldCenter());
    world.CreateJoint(frontJoint);

    car = new Object();
    car.chassis = chassis;
    car.backShock = backShock;
    car.frontShock = frontShock;
    car.backWheel = backWheel;
    car.frontWheel = frontWheel;
    return car;
}

// Takes a world, three points in the form of [x,y]
// And a center c in the form of [x,y].
// Creates a triangle which extends to
// the specified points relatvie to the center.
// Returns the triangle.
function createStaticTriangle(world, p0, p1, p2, c) {
    var fixTri = new b2FixtureDef;
    fixTri.shape = new b2PolygonShape;
    fixTri.density = 1.0;
    fixTri.friction = 2.0;
    fixTri.restitution = .5;
            
    fixTri.shape.SetAsArray([
       new b2Vec2(p0[0], p0[1]),
       new b2Vec2(p1[0], p1[1]),
       new b2Vec2(p2[0], p2[1])],3
    );

    var bodyTri = new b2BodyDef;
    bodyTri.type = b2Body.b2_staticBody;    
    bodyTri.position.Set(c[0], c[1]);
    var b = world.CreateBody(bodyTri);
    b.CreateFixture(fixTri);
    return b;
}

// The following three functions have to do with drawing box2d elements using 
// the canvas, and updating the game when using such elements.

// Here is the object for the main element in box2d, which contains a body,
// the scale at which to draw the body, and a path to the image for that body.
function B2CanvasElement(b2dBody, scale, imagePath) {
    this.b2dBody = b2dBody;
    this.scale = scale;
    this.image = new Image();
    this.image.src = imagePath;
    this.x = function() {
        return b2dBody.m_sweep.c.x
    }
    this.y = function() {
        return b2dBody.m_sweep.c.y
    }
    //this.angle = b2Body.GetAngle();

    //var angle = this.angle;
    var x = this.x;
    var y = this.y;
    var image = this.image;

    this.draw = function(context) {
        if (image != null) {
            //context.rotate(angle);
            context.drawImage(image, x()*scale, y()*scale);
        }
        else {
            console.log("Could not draw image");
        }
    }
}


// Here is a function which clears the canvas and redraws the elements.
function drawB2Graphics(canvas, context, listOfB2CanvasElements) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    for (var i = 0; (i < listOfB2CanvasElements.length); i++) {
        listOfB2CanvasElements[i].draw(context);    
    }
}


// This function takes a box2d world, canvas, context, and the elements inside
// the world, and updates said world a preset amount, including drawing 
// graphics.
function updateBox2dGame(world, canvas, context, listOfB2CanvasElements) {
    // stepping box2dworld
    world.Step(1 / 60, 10, 10);
    world.ClearForces();
    // Graphics
    drawB2Graphics(canvas, context, listOfB2CanvasElements);
}

