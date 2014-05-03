$(document).ready(function() {
	var gameTime = 0;
	var flipTime = 2000;
	var frameTime = 1000/60; 
	var playerSpeed = 0;
	var playerPos;
			
	// Click Handlers
	// ========================================================================
	$('#goLeft').on('mousedown touchstart click', function() {
		$('#player').css('background-image', 'hunterLeft.png');
		var playerPos = $('#player').css('left');
		if (playerSpeed > -5) {
			playerSpeed -= 1.5;
		}
		
	});
	$('#goRight').on('mousedown touchstart click', function() {
		$('#player').css('background-image', 'hunterRight.png');
		if (playerSpeed < 5) {
			playerSpeed += 1.5;
		}
	});
	
	var mainLoop = function() {
		checkLose();
		checkWin();
		
		playerPos = parseInt($('#player').css('left'));
		$('#player').css('left', (playerPos+playerSpeed) + 'px');
		
		if (gameTime % 2000 === 0) {
			if (facingForward) {
				// make badGuy face backward			
				$('#badGuy1').css('background-image', 'url(img/monsterBackward.jpg)');
				$('#badGuy2').css('background-image', 'url(img/monsterBackward.jpg)');
				$('#badGuy3').css('background-image', 'url(img/monsterBackward.jpg)');
				$('#lineOfSight1').fadeOut('fast');
				$('#lineOfSight2').fadeIn('fast');
				$('#lineOfSight3').fadeOut('fast');
				facingForward = 0;
			}
			else {
				// make badGuy face forward
				$('#badGuy1').css('background-image', 'url(img/monsterForward.jpg)');
				$('#badGuy2').css('background-image', 'url(img/monsterForward.jpg)');
				$('#badGuy3').css('background-image', 'url(img/monsterForward.jpg)');
				$('#lineOfSight1').fadeIn('fast');
				$('#lineOfSight2').fadeOut('fast');
				$('#lineOfSight3').fadeIn('fast');
				facingForward = 1;
			}
		}
		gameTime += Math.floor(frameTime);
	};
	
	var checkLose = function(facingForward) {
		var pos = parseInt($('#player').css('left'));
		
		if (0) {
			console.log('game over');
		}
	}
	var checkWin = function() {
		var pos = parseInt($('#player').css('left'));
		var winCondition = parseInt($('#finishLine').css('left'));		
		if (0) {
			console.log('win');
		}
	}
	setInterval(mainLoop, frameTime);
});
