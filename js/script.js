
/* ========================================================================
* script.js v0.4
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Warioware framework that loads different games, handles
* transitions and scoring
* ======================================================================== */


// ==============================================================================
// Stuff for getting data from TechCafe with init() -- see gamelib.js
// ===============================================================================

// Randomize order of answer choices.
// ===================================================
function randomizeAnswers(questions) {
	// Shuffle from http://www.htmlblog.us/random-javascript-array
	for (var iter = 0; iter < questions.length; iter++) {
		var possibleAnswers = questions[iter].possibleAnswers;

		var i = possibleAnswers.length, j, temp;
		while ( --i )
		{
			j = Math.floor( Math.random() * (i - 1) );
			temp = possibleAnswers[i];
			possibleAnswers[i] = possibleAnswers[j];
			possibleAnswers[j] = temp;
		}
	}
}
var initObj;  // stores the game object returned from the server by init()
// Callback function passed to init().  Retrieves initObj and randomizes answers.
// ===================================================
function callback(data) {
			// Set global asst to the initObj recieved from server.
			// Refer to Documentation for more information on initObj
			initObj = data.initObj;
			randomizeAnswers(initObj.questions); // Shuffle the answers sequences!
			console.log(initObj);
}
// Other variables to pass into init()
var DEVELOPER_ID = "4ddddddddeeeeeeee0000001";  
var TEST_MODE = true;  	// make this false when using real data

// ===============================================================================
// ===============================================================================



// ==============================================================================
//  (                            (                              
//  )\ )                  (      )\ )                           
// (()/(    )        (    )\ )  (()/(  (       )     )      (   
//  /(_))( /(  `  )  )\  (()/(   /(_)) )(   ( /(    (      ))\  
// (_))  )(_)) /(/( ((_)  ((_)) (_))_|(()\  )(_))   )\  ' /((_) 
// | _ \((_)_ ((_)_\ (_)  _| |  | |_   ((_)((_)_  _((_)) (_))   
// |   // _` || '_ \)| |/ _` |  | __| | '_|/ _` || '  \()/ -_)  
// |_|_\\__,_|| .__/ |_|\__,_|  |_|   |_|  \__,_||_|_|_| \___| 
//            |_|  
// ===============================================================================

/* Variable Names */
var nGames, fenceContainer, totalScore, gamesPlayed, askQuestionNext;
gameOver = false;
gamesPlayed = 0;
askQuestionNext = false;
totalScore = 0;

var gameObjectsArray = [];

// index of the next question we want to ask
questionIndex = 0;

/* Function Names */
var invertWidthHeight, setupGameplayHandlers, nextGame, startGame1,
askQuestion, startGame2, startGame3, startGame4;

$(document).ready(function () {
  init(callback, DEVELOPER_ID, TEST_MODE);

  fenceContainer = document.getElementById('fence-container');

  // Turning scrolling off
  $("body").css("overflow", "hidden");

  invertWidthHeight();
  setupGameplayHandlers();

  //Loading js files for all game instances
  $("#gameJs").load( "./games/gameList.html");
});

// Fitting transition overlay on multiple screen sizes
// ===================================================
function invertWidthHeight() {
  $("#right-card").height($(window).width());
  $("#right-card").width($(window).height());

  $("#left-card").height($(window).width());
  $("#left-card").width($(window).height());
}

// Fitting to screen in case of screen resize
// ===================================================
$(window).resize(function () {
  invertWidthHeight();
});

// Handles setting up of and timing between game transitions
// =========================================================
function setupGameplayHandlers() {
  var card = document.getElementById('bottom-card');

  /* Hadler for finishing of a transition animation */
  fenceContainer.addEventListener("webkitAnimationEnd", function (e) {
    if (e.animationName === "pan-in") {
      $("#fence-container").css('visibility', 'hidden');
    } else if (e.animationName === "knock-over") {
      fenceContainer.className = "lateral-move";
      nextGame();
    } else if (e.animationName === "pan-out") {
      $(".door-holder").removeClass("not-slided");
      $(".door-holder").addClass("slided");
    } else if (e.animationName === "slidein-left-door") {
      $(".door-holder").removeClass("slided");
      $(".door-holder").addClass("not-slided");
      // If the game is not over, go to the next minigame
      // Otherwise we go to the game over screen which displays score.
      if (gameOver === false) {
        nextGame();
      }
      else {
        lastScreen();
      }
    } else if (e.animationName === "slideout-left-door") {
      fenceContainer.className = "lateral-move";
    }
  }, false);

  /* Triggering flip over animation for start screen */
  document.getElementById('bottom-card').addEventListener('click', function () {
    card.className = card.className + " flipped";
  }, false);
}

// Called by a mini-gme once a game has terminated
// ===============================================
function gameFinished(result) {
  /* updating score based on result */
  if (result === true) {

    $("#score-display").text("+100").fadeIn(300, function(){
      $("#score-display").fadeOut();
    });
    $(".game-door").css("background","gold");
    totalScore += 100;
  }
  else {
    $("#score-display").text("-50").fadeIn(300, function(){
      $("#score-display").fadeOut();
    });
    $(".game-door").css("background","red");
    totalScore -= 50;
  }

  $("#fence-container").css('visibility', '');
  fenceContainer.className = "lateral-back";
}

// Randomly selecting and displaying a minigame to the user
// ========================================================
function nextGame() {

  /* Question or game element ids */
  var question = document.getElementById("questionScreen");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (questionIndex === initObj.questions.length) {
    gameOver = true;
    $('#canvas').remove();
    lastScreen();
    return;
  }

  // Iteratively ask questions or play games.
  if (askQuestionNext == true) {
    askQuestionNext = false;
  	// load a new question
  	askQuestion();
  	question.style.visibility= "visible";
  	canvas.style.visibility = "hidden";
  } 
  else {
   askQuestionNext = true;
   question.style.visibility = "hidden";
   canvas.style.visibility = "visible";
   
   //We choose which game to play randomly from among the games list.
   var gameIndex = Math.floor(Math.random() * gameObjectsArray.length);
   gameObjectsArray[gameIndex].startGame();
   gamesPlayed++;
 }

}

// Displays the score and any options for after the game has been played
// =====================================================================
// Needs to be implemented
function lastScreen() {
  var scoreString = totalScore.toString();
  $("#scoreScreen").css('visibility', 'visible');
  $("#score").append(scoreString);
}