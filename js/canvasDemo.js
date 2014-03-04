canvasDemo = new Game();

canvasDemo.startGame = function() {
	var that = this;

	// Creating box2d world
	that.world = new b2World(new b2Vec2(0, 20), false);

	// Setting up scale, width and height, and the canvas
	var scale = 4;
	var windowWidth = 3*(window.innerWidth/scale)/4;
	var windowHeight = 3*(window.innerHeight/scale)/4;
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	// Creating the list that we'll put our elements in
	var listOfB2CanvasElements = [];

	// Creating bodies in box2d
	var box = createBox(that.world, windowWidth/2, windowHeight/2, 1, .5);
	var otherBox = createBox(that.world, windowWidth/3, windowHeight/3, 1, .5);
	var floor = createStaticBox(that.world, windowWidth/2, windowHeight, windowWidth, 1);

	box.SetAngle(1);

	// console.log("red:" otherBox.GetAngle());

	// Creating b2canvas elements from those bodies and putting them in the list
	var boxCanvasElem = new B2CanvasElement(box, scale, "./images/player1.png");
	console.log(boxCanvasElem.xOffset);
	var otherBoxCanvasElem = new B2CanvasElement(otherBox, scale, "./images/player2.png");
	var floorCanvasElem = new B2CanvasElement(floor, scale, "./images/phone.png", 2);
	listOfB2CanvasElements.push(boxCanvasElem);
	listOfB2CanvasElements.push(otherBoxCanvasElem);
	listOfB2CanvasElements.push(floorCanvasElem);

	// Updating the world, which automatically draws the images
	var update = function() {
		updateBox2dGame(that.world, canvas, context, listOfB2CanvasElements);
	}
    window.setInterval(update, 5);

}

canvasDemo.endGame = function() {
	gameFinished(true);
}