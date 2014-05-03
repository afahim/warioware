/* =======================================================================
* Musical Rhythm Game v0.1
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Musical notes fall along three tracks.  The goal is to hit
* the corresponding buttons in time with when the notes cross through the
* target zone.
* ======================================================================== */

rhythm = new Game();

rhythm.difficulty = 0;

rhythm.startGame = function() {
		var that = this;

	// Difficulty level variables
	var numNotes = 2 + this.difficulty;
	var noteSpeed = 1 + this.difficulty;  // pixels moved each update
	// The game will always get harder. There is no max difficulty.

	// Initialize the canvas to the window size
	var canvas = document.getElementById('canvas');
	var w = $(window).width();
	var h = $(window).height();
	canvas.setAttribute('width', w);
	canvas.setAttribute('height', h);
	var context = canvas.getContext('2d');

	// Insert the html for the buttons
	var newHTML = '<div id="rhythm">' +
				    '<button class="button" id="button0"></button>' +
				    '<button class="button" id="button1"></button>' +
				    '<button class="button" id="button2"></button>' +
				    '<audio id="note1" src="games/rhythm/audio/note1.mp3"></audio>' +
				    '<audio id="note2" src="games/rhythm/audio/note2.mp3"></audio>' +
				    '<audio id="note3" src="games/rhythm/audio/note3.mp3"></audio>' +
				  '</div>';
	$('body').prepend(newHTML);

	// Load the stylesheet for the buttons
	$('head').append('<link rel="stylesheet" href="./games/rhythm/rhythm.css" type="text/css" />');

	// Indentifying the notes for later using
	var note1 = document.getElementById("note1");
	var note2 = document.getElementById("note2");
	var note3 = document.getElementById("note3");
	note1.volume = .3;
	note2.volume = .3;
	note3.volume = .3;

	// Align the target buttons to each note track
	$('#button0').css('left', 0);
	$('#button0').css('width', w/3 - 5);
	$('#button1').css('left', w/3 + 5);
	$('#button1').css('width', w/3 - 10);
	$('#button2').css('left', 2*w/3 + 5);
	$('#button2').css('width', w/3 - 10);

	var buttonsPressed = [];  // array keeps track of which buttons are currently pressed

	var noteList = createNoteList(numNotes);    // generate a list of notes
	that.gameLoop = setInterval(update, 10);    	 // start the game loop

	that.gameOver = false; // The game just started


	// Click handlers: light up buttons when clicked
	// ==============================================
	$('#button0').on('mousedown touchstart click', function() {
		note1.play();
		$('#button0').css('background-color', '#f1c40f');
		buttonsPressed.push(0);        // add to currently pressed list
	}).bind('mouseup touchend click mouseleave', function() {
		$('#button0').css('background-color', 'red');
		var idx = buttonsPressed.indexOf(0);
		buttonsPressed.splice(idx, 1);  // remove from currently pressed list
	});
	$('#button1').on('mousedown touchstart click', function() {
		note2.play();
		$('#button1').css('background-color', '#f1c40f');
		buttonsPressed.push(1);
	}).bind('mouseup touchend click mouseleave', function() {
		$('#button1').css('background-color', 'green');
		var idx = buttonsPressed.indexOf(1);
		buttonsPressed.splice(idx, 1);
	});
	$('#button2').on('mousedown touchstart click', function() {
		note3.play();
		$('#button2').css('background-color', '#f1c40f');
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
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// createNoteList: generate a random list of numNotes notes,
	// evenly spread between the tracks
	// =============================================================
	function createNoteList(numNotes) {
		// generate random starting heights for the notes, ensuring no overlap
		var startingHeights = [];
		// build a list of possible starting heights
		var maxHeight = 250 * numNotes;
		var heightList = [];
		for (i = 200; i < maxHeight; i += 200) {
			heightList.push(-i);
		}
		// randomly select a subset of the starting heights
		var startingHeights = [];
		for (i = 0; i < numNotes; i++) {
			var randIdx = Math.floor(Math.random()*heightList.length);
			startingHeights.push(heightList[randIdx]);
			// remove this height from the remaining possibilites
			heightList.splice(randIdx, 1);
		}
		console.log(startingHeights);
		// midpoint of each column
		var trackWidths = [w/6, w/2, 5*w/6];
		// assign each starting height to a note and push onto the noteList
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
	function update() {
		for (i=0; i<noteList.length; i++) {
			note = noteList[i];
			// if note is not already destroyed, move it an incremental amount
			if (note != null) {
				note.y += noteSpeed;
			}
		}
		updateGame(context, w, h, noteList, buttonsPressed);
	}

	function notesAreAllGone(h, r) {
		// if any note is still on the screen, don't end the game
		var notesAllGone = true;
		for (i=0; i < noteList.length; i++) {
			note = noteList[i];
			if (note == null) {
				continue;
			}
			if (note.y - r <= h) {
				notesAllGone = false;
			}
		}
		return notesAllGone;
	}


	// updateGame: Update the game screen each time step
	// ============================================================
	function updateGame(context, w, h, noteList, buttonsPressed) {
		// clear canvas for redraw
		context.clearRect(0, 0, w, h);
		// make note tracks with gradients
		var grd=context.createLinearGradient(0,0,0,h/5);  // track1
		grd.addColorStop(0,"#fff"); //white
		grd.addColorStop(1,"#e74c3c");
		context.fillStyle=grd;
		context.fillRect(0,0,w/3, h);
		var grd=context.createLinearGradient(w/3,0,w/3,h/5);  // track2
		grd.addColorStop(0,"#fff"); //white
		grd.addColorStop(1,"#2ecc71");
		context.fillStyle=grd;
		context.fillRect(w/3,0,w/3, h);
		var grd=context.createLinearGradient(2*w/3,0,2*w/3,h/5);   // track3
		grd.addColorStop(0,"#fff"); //white
		grd.addColorStop(1,"#3498db");
		context.fillStyle=grd;
		context.fillRect(2*w/3,0,2*w/3, h);

		// make dividing lines between tracks
		context.beginPath();    // between track 1 and 2
		context.moveTo(w/3, 0);
		context.lineTo(w/3, h);
		context.lineWidth = 3;
		context.stroke();
		context.beginPath();   // between track 2 and 3
		context.moveTo(2*w/3, 0);
		context.lineTo(2*w/3, h);
		context.lineWidth = 3;
		context.stroke();

		var buttonTop = parseInt($('.button').css('top'));

		// Initialize buttons to normal (not highlighted)
		for (i=0; i < 3; i++) {
			var b = '#button' + i;
			$(b).css('border-color', 'black');
		}

		//draw the notes in their new positions
		for (i=0; i < noteList.length; i++) {
			note = noteList[i];
			// check if note is already destroyed
			if (note === null) {
				continue;
			}
			// draw a circle for the note
			context.beginPath();
			var trackWidth = w/3;			// width of a note track
			var x = note.x;          		// The X coordinate
			var y = note.y;         	    // The Y cooordinate
			var r = trackWidth / 8;
			var start = 0;           		// The start angle (in radians)
			var end = 2 * Math.PI;   		// The end angle (in radians)
			var anticlockwise = false;      // Direction of ellipse drawing
			context.lineWidth = 1;
			context.arc(x, y, r, start, end, anticlockwise);
			// fill the ellipse with a gradient
		    var grd = context.createLinearGradient(0,0,0,h/5);
		    grd.addColorStop(0, '#fff');
		    grd.addColorStop(1, '#f1c40f');
			context.fillStyle = grd;
	        context.fill();
			context.stroke();

			// if this note is crossing a button, highlight the corresponding button,
			// and check if the user is pressing that button
			if ((y >= buttonTop - r) && (y <= h)) {
				var buttonIdx = i%3;
				var b = '#button' + buttonIdx;
				$(b).css('border-color', 'yellow');  // note crossing a button
				// check if user is pressing the correct button
				checkBang(buttonsPressed, buttonIdx, noteList, note);
			}
		}

		// if all notes are off screen, check win conditions
		if (notesAreAllGone(h, r) === true) {
			checkWin(noteList);
		}

	};

	// checkBang: called when a note is crossing a button. Checks if user is pressing the
	// corresponding button, and if so destroys that button
	// ============================================================
	function checkBang(buttonsPressed, buttonIdx, noteList, note) {
		var buttonID = '#button' + buttonIdx;
		if (buttonsPressed.indexOf(buttonIdx) > -1) {
			// destroy the note
			noteIdx = noteList.indexOf(note);
			noteList[noteIdx] = null;
			//console.log('Hit note' + noteIdx + '!');
		}
	}

	function checkWin(noteList) {
		var winner = true;
		// winning implies all notes are now null
		for (i = 0; i < noteList.length; i++) {
			if (noteList[i] != null) {
				winner = false;
			}
		}
		if (winner) {
			that.winOrLoss = true;
			if (!that.gameOver) {
				that.endGame();
			}
			that.gameOver = true;
		}
		else {
			that.winOrLoss = false;
			if (!that.gameOver) {
				that.endGame();
			}
			that.gameOver = true;
		}
	}
}

rhythm.endGame = function() {
	var that = this;
	that.gameOver = true;
	// Difficulty change
	if (that.gameOver) {
		that.difficulty++;
	} else {
		that.difficulty--;
		if (that.difficulty < 0) {
			that.difficulty = 0;
		}
	}
	function clearWrapper() {
		clearInterval(that.gameLoop);
		gameFinished(that.winOrLoss);
	}
	function removeHTMLWrapper() {
		$('#rhythm').remove(); // remove the html
	}
	setTimeout(clearWrapper, 100);
	setTimeout(removeHTMLWrapper, 2000);
	return;
}


gameObjectsArray.push(rhythm);

