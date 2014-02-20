function startGame2() {
    var engine = document.createElement('audio');
    engine.setAttribute('src', 'sounds/engine.wav');        
    var count = 3; // This is the initial countdown before the race
    document.getElementById("startTime").innerHTML=count;
    var mainGame = function() {

        var gasPedalPushed = false; // The gas starts not pressed down
        // The car moves at rates dependent on the gas pedal being down or not      
        var gasPedalPushedRate = 5;    
        var gasPedalNotPushedRate = 2; 
        
        $('#gas').mousedown(function() {
            $('#player1').clearQueue();
            engine.play();  
            gasPedalPushed = true;
        }).bind('mouseup', function() {
            $('#player1').clearQueue();
            engine.pause();
            gasPedalPushed = false;
        });
        $(document).keydown(function(e) {
            if (e.which == 68) { // 68 is 'd'
                // We have clearQueue at the beginning so that there is no
                // significant delay between the input and the car's movement
                $('#player1').clearQueue();
                engine.play();
                if (!gasPedalPushed) {
                    console.log("gas down");
                    gasPedalPushed = true; // If you start holding d,
                }                          // the gas is down
            }
        });

        $(document).keyup(function(e) {
            if (e.which == 68) {
                $('#player1').clearQueue();
                engine.pause();
                console.log("gas up");
                gasPedalPushed = false; // If you stop holding d, the gas is up
            }
        });

        var moveBadguy = function() {
            // The bad guy always moves at a constant speed
            $('#player2').animate({left: '+=3px'}, 5);
        };

        var moveGoodguy = function() {
            // If the gas pedal is down, move the green car by
            // gasPedalPushedRate pixels
            if (gasPedalPushed) {
                $('#player1').animate(
                    {left: '+=' + gasPedalPushedRate + 'px'}, 1 
                    );
            }
            // If the gas pedal is not down, move the green car by
            // gasPedalNotPushedRate pixels
            else {
                $('#player1').animate(
                    {left: '+=' + gasPedalNotPushedRate + 'px'}, 1
                    );
            }
        };
        var checkWin = function() {
            // Getting data from CSS elements to check if the win
            // or loss condition has been met
            var p1pos = parseInt($('#player1').css('left'));
            var p2pos = parseInt($('#player2').css('left'));
            var winpos = parseInt($('#finish').css('left'));
            // If either car's position is past the finish line
            if ((p1pos > winpos) || (p2pos > winpos)) {
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
        // Update timings for the different functions, in milliseconds
        setInterval(moveGoodguy, 5);
        setInterval(moveBadguy, 5);
        setInterval(checkWin, 100);
    }

    // This function counts down in order to begin the race
    function timer() {
        count = count-1;
        // Continue counting down after decrementing timer by one
        if (count > 0) {
            document.getElementById("startTime").innerHTML=count;
        }
        // Tell player to go!
        else if (count == 0) {
            document.getElementById("startTime").innerHTML="GO";
            mainGame();
            setTimeout(function(){
                $('#startTime').hide(100);
            }, 500);
        }
        else {
            return;
        }
    }
    setInterval(timer, 1000);
}