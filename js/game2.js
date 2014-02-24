/* ========================================================================
* Warioware: game2.js v0.1
* https://github.com/afahim/warioware/
* ========================================================================
* Copyright 2014 Techbridgeworld, Inc.
* Developed for 15-239 (http://www.cs.cmu.edu/~./239/about/)
* ======================================================================== */

/* =======================================================================
* Car Race Game v0.1
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: User holds down a gas pedal to win a car race.
* ======================================================================== */

function startGame2() {
	// Set up the audio elements
    var engine = document.createElement('audio');
    engine.setAttribute('src', 'sounds/engine.wav');  
    // Game loops for updating car positions and checking win conditions
	var moveGoodInterval, moveBadInterval, chkWinInterval;
	// Set up the initial countdown 
    var count = 3; 			// Number of seconds to count down
    document.getElementById("startTime").innerHTML=count;
    
    
    // Countdown: This function counts down a timer in order to begin the race
    // ========================================================================
    function timer() {
        count = count-1;
        // Continue counting down after decrementing timer by one
        if (count > 0) {
            document.getElementById("startTime").innerHTML=count;
        }
        // Start the main game and tell player to go!
        else if (count == 0) {
            document.getElementById("startTime").innerHTML="GO";
            setTimeout(function(){
                $('#startTime').hide(100);
            }, 500);
            mainGame();  // call the main game function
        }
        else {
            return;
        }
    }
    setInterval(timer, 1000);  // updates the countdown timer every second
    
    
    // This function counts down a timer in order to begin the race
    // ========================================================================
    var mainGame = function() {
        var gasPedalPushed = false; // The gas starts not pressed down
        // Car movement rates, dependent on whether gas pedal is pushed 
        var gasPedalPushedRate = 5;    
        var gasPedalNotPushedRate = 2; 
        
        //  If the player pushes the gas pedal, start the 
        $('body').mousedown(function() {
            $('#player1').clearQueue(); // clear any backlogged animations
            engine.play();  			// play the engine sound
            gasPedalPushed = true;		// this will initiate the car movement
        }).bind('mouseup', function() {
            $('#player1').clearQueue();
            engine.pause();
            gasPedalPushed = false;
        });

		/* Update the badguy car position (called repeatedly by setInterval) */
        var moveBadguy = function() {
            // The bad guy always moves at a constant speed
            $('#player2').animate({left: '+=3px'}, 5);
        };

		/* Update the goodguy car position at a rate dependent on whether gas
		   pedal is pushed or not */
        var moveGoodguy = function() {
        	// Gas pedal pushed
            if (gasPedalPushed) {
                $('#player1').animate(
                    {left: '+=' + gasPedalPushedRate + 'px'}, 1 
                    );
            }
            // Gas pedal not pushed
            else {
                $('#player1').animate(
                    {left: '+=' + gasPedalNotPushedRate + 'px'}, 1
                    );
            }
        };
        
        /* Check whether the game is over, and if so, who won */
        var checkWin = function() {
            // Getting data from CSS elements to check if the win
            // or loss condition has been met
            var p1pos = parseInt($('#player1').css('left'));
            var p2pos = parseInt($('#player2').css('left'));
            var winpos = parseInt($('#finish').css('left'));
            // If either car's position is past the finish line
            if ((p1pos > winpos) || (p2pos > winpos)) {
            	// Stop the game loops and clear animation backlogs
                clearInterval(moveGoodInterval);
                clearInterval(moveBadInterval);
                clearInterval(chkWinInterval);
                $('#player1').clearQueue();
                $('#player2').clearQueue();
                // The player wins.
                if (p1pos > p2pos) {
                    gameFinished();
                }
                // The player loses.
                else {
                    gameFinished();
                }
            }
        }
        
        // Repeatedly update the car positions and check for win conditions
        moveGoodInterval = setInterval(moveGoodguy, 5);
        moveBadInterval = setInterval(moveBadguy, 5);
        chkWinInterval = setInterval(checkWin, 100);
	}
}