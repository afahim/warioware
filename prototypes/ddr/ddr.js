/* =======================================================================
* Musical Rhythm Game v0.1
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Musical notes fall along three tracks.  The goal is to hit
* the corresponding buttons in time with when the notes cross through the
* target zone.
* ======================================================================== */


function startGame3() {

	// Initialize the canvas to the window size
	var canvas = document.getElementById('myCanvas');
	var w = $(window).width();
	var h = $(window).height();
	canvas.setAttribute('width', w);
	canvas.setAttribute('height', h);
	var context = canvas.getContext('2d');

	// Create the target buttons for each note track
	$('#button0').css('left', 0);
	$('#button0').css('width', w/3 - 5);
	$('#button1').css('left', w/3 + 5);
	$('#button1').css('width', w/3 - 10);	
	$('#button2').css('left', 2*w/3 + 5);
	$('#button2').css('width', w/3 - 10);

	var buttonsPressed = [];  // array keeps track of which buttons are currently pressed

	// Click handlers: light up buttons when clicked
	// ==============================================
	$('#button0').on('mousedown touchstart click', function() {
		$('#button0').css('background-color', 'yellow');
		buttonsPressed.push(0);        // add to currently pressed list
	}).bind('mouseup touchend click mouseleave', function() {
		$('#button0').css('background-color', 'red');
		var idx = buttonsPressed.indexOf(0);
		buttonsPressed.splice(idx, 1);  // remove from currently pressed list
	});
	$('#button1').on('mousedown touchstart click', function() {
		$('#button1').css('background-color', 'yellow');
		buttonsPressed.push(1); 
	}).bind('mouseup touchend click mouseleave', function() {
		$('#button1').css('background-color', 'green');
		var idx = buttonsPressed.indexOf(1);
		buttonsPressed.splice(idx, 1);
	});
	$('#button2').on('mousedown touchstart click', function() {
		$('#button2').css('background-color', 'yellow');
		buttonsPressed.push(2);
	}).bind('mouseup touchend click mouseleave', function() {
		$('#button2').css('background-color', 'blue');
		var idx = buttonsPressed.indexOf(2);
		buttonsPressed.splice(idx, 1);
	});

	// Note: Object representing the center point of notes.
	// ==============================================
	function Note(x, y) {
			this.x = x;
			this.y = y;
	}

	// getRandomInt: Generate a random integer between min and max
	// ===============================================================
	var getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// createNoteList: generate a random list of numNotes notes,
	// evenly spread between the tracks
	// ==============================================================
	var createNoteList = function(numNotes) {
		var trackWidths = [w/6, w/2, 5*w/6];
		// generate random starting heights for the notes, ensuring no overlap
		var startingHeights = [0, -75, -175, -350, -700, -500];
		var noteList = [];
		for (i = 0; i < numNotes; i++) {
			var noteWidth = trackWidths[i % 3]; 
			var noteHeight = startingHeights[i];
			var note = new Note(noteWidth, noteHeight);
			noteList.push(note);
		}
		return noteList;
	}

	// update: update the screen and note positions by calling updateGame()
	// ====================================================================	
	var update = function() {
		for (i=0; i<noteList.length; i++) {
			note = noteList[i];
			// if note is not already destroyed, move it an incremental amount
			if (note != null) {
				note.y += 3;
			}
		}
		updateGame(context, w, h, noteList, buttonsPressed);
	}

	var noteList = createNoteList(6);    		 // generate a list of notes
	var gameLoop = setInterval(update, 10);    	 // start the game loop
		 
	// updateGame: Update the game screen each time step
	// ============================================================	
	var updateGame = function(context, w, h, noteList, buttonsPressed, gameLoop) {
		// clear canvas for redraw
		context.save();
		context.clearRect(0, 0, w, h);
		context.restore();

		// make note tracks with gradients
		var grd=context.createLinearGradient(0,0,0,h);  // track1
		grd.addColorStop(0,"black");
		grd.addColorStop(1,"red");
		context.fillStyle=grd;
		context.fillRect(0,0,w/3, h);
		var grd=context.createLinearGradient(w/3,0,w/3,h);  // track2
		grd.addColorStop(0,"black");
		grd.addColorStop(1,"green");
		context.fillStyle=grd;
		context.fillRect(w/3,0,w/3, h);
		var grd=context.createLinearGradient(2*w/3,0,2*w/3,h);   // track3
		grd.addColorStop(0,"black");
		grd.addColorStop(1,"blue");
		context.fillStyle=grd;
		context.fillRect(2*w/3,0,2*w/3, h);
		
		// make dividing lines between tracks
		context.beginPath();    // between track 1 and 2
		context.moveTo(w/3, 0);
		context.lineTo(w/3, h);
		context.lineWidth = 5;
		context.stroke();
		context.beginPath();   // between track 2 and 3
		context.moveTo(2*w/3, 0);
		context.lineTo(2*w/3, h);
		context.lineWidth = 5;
		context.stroke();
		
		
		var buttonTop = parseInt($('.button').css('top'));
		var buttonHeight = parseInt($('.button').css('height')); 
		
		// Initialize buttons to normal (not highlighted)
		for (i=0; i < 3; i++) {
			var b = '#button' + i;
			$(b).css('border-color', 'black');
		}
		
		var notesAllGone = 1;   // if all notes have passed
		//draw the notes in their new positions
		for (i=0; i < noteList.length; i++) {
			note = noteList[i];
			// check if note is already destroyed
			if (note === null) {
				continue;
			}
			
			// draw an ellipse for the note
			context.beginPath(); 
			var x = note.x;          		// The X coordinate
			var y = note.y;         	    // The Y cooordinate
			var rx = 125;            		// The X radius
			var ry = 50;             		// The Y radius
			var rotation = 0;        		// The rotation of the ellipse (in radians)
			var start = 0;           		// The start angle (in radians)
			var end = 2 * Math.PI;   		// The end angle (in radians)
			var anticlockwise = false;      // Direction of ellipse drawing
			context.lineWidth = 1;
			context.ellipse(x, y, rx, ry, rotation, start, end, anticlockwise);
			
			// fill the ellipse with a gradient
		    var grd = context.createLinearGradient(0,0,0,h);
		    grd.addColorStop(0, 'black');
		    grd.addColorStop(1, '#FFFF33');
			context.fillStyle = grd;
	        context.fill();
			context.stroke();
			
			// if this note is crossing a button, highlight the corresponding button,
			// and check if the user is pressing that button
			if ((y >= buttonTop - ry) && (y <= buttonTop + buttonHeight)) {
				var buttonIdx = i%3;
				var b = '#button' + buttonIdx;
				$(b).css('border-color', 'yellow');  // note crossing a button
				// check if user is pressing the correct button
				checkBang(buttonsPressed, buttonIdx, noteList, note);
			}
			// if this a note is still on the screen, don't end the game
			if (y <= buttonTop + buttonHeight) {
				notesAllGone = 0;
			}
		}
		
		// if all notes are off screen, check win conditions
		if (notesAllGone) {
			checkWin(noteList, gameLoop);
		}
			
	};

	// checkBang: called when a note is crossing a button. Checks if user is pressing the
	// corresponding button, and if so destroys that button
	// ============================================================	
	var checkBang = function(buttonsPressed, buttonIdx, noteList, note) {
		var buttonID = '#button' + buttonIdx;	
		if (buttonsPressed.indexOf(buttonIdx) > -1) {
			// destroy the note
			noteIdx = noteList.indexOf(note);
			noteList[noteIdx] = null;
			//console.log('Hit note' + noteIdx + '!');
		}
	}

	var checkWin = function(noteList, gameLoop) {
		var winner = true;
		clearInterval(gameLoop);
		for (i = 0; i < noteList.length; i++) {
			if (noteList[i] != null) {
				winner = false;
			}
		}
		
		if (winner) {
			console.log('you win');
			gameFinished(true);
		}
		else {
			console.log('you lose');
			gameFinished(false);
		}
	}
}
