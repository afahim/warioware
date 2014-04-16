/* =======================================================================
* Soccer Kick Game v0.1
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Holding down a button causes a kick power meter to increase.  The player
* wins if the button is released with the power meter at least as full as the 
* win condition (defined at top of function).
* ======================================================================== */

function startGame4() {
	var gameTime = 0;
	var frameTime = 1000/60;
	var kickLoop;
	var winCondition = 0.75;   // percentage the kick meter needs to be to win 
	var directionUp = true;    // direction of charge meter change (initially up)
	
	// Click Handlers
	// ========================================================================
	$('#kickButton').on('mousedown touchstart click', function() {
		$('#player').css('background-image', 'url(images/playerKickStart.png)');
		kickLoop = setInterval(kicking, 10);   // start the kicking loop
	}).bind('mouseup touchend click mouseleave', function() {
		$('#player').css('background-image', 'url(images/playerKickFinish.png)');
		kickFinished = 1;
		clearInterval(kickLoop);   // end the kicking loop
		kickEnd();				   // finish kick and check win conditions
	});
	
	// kicking: While user holds down kick button, move the charge meter.
	// ========================================================================
	var kicking = function() {
		var maxWidth = parseInt($('#chargeBox').css('width'));
		var currentWidth = parseInt($('#chargeFull').css('width'));
		var stepSize = maxWidth / 50;
		if (currentWidth <= 0) {
			directionUp = true;
		}
		if ((currentWidth < maxWidth) && directionUp) {
			var newWidth = currentWidth + stepSize;	
			$('#chargeFull').css('width', newWidth);
		}
		else {
			directionUp = false;
			var newWidth = currentWidth - stepSize;	
			$('#chargeFull').css('width', newWidth);
		}
	}
	
	// kickEnd: When user releases kick button, check how full the kick meter is.
	// If kick meter is greater than win condition, move ball to finish line and user 
	// wins.  Otherwise, move ball part way to finish line and user loses.
	// ========================================================================
	var kickEnd = function() {
		var winCondition = 0.75;    // percentage full required to win
		
		// get actual percentage full
		var maxWidth = parseInt($('#chargeBox').css('width'));
		var chargePct = parseInt($('#chargeFull').css('width')) / maxWidth;
		
		// get the initial distance from ball to goal
		var ballInitPos = parseInt($('#ball').css('left'));
		var goalDistance = parseInt($('#goal').css('left')) - ballInitPos;
		
		// check win conditions and move ball accordingly
		if (chargePct >= winCondition) {
			ballEndPos = goalDistance + ballInitPos;
			$('#ball').animate({left: ballEndPos}, 500);
			gameFinished(true);
		}
		else {
			var ballEndPos = (chargePct * goalDistance) + ballInitPos;
			$('#ball').animate({left: ballEndPos}, 500);
			gameFinished(false);
		}
		
	}
}
