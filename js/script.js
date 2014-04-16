/* ========================================================================
* script.js v0.4
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Warioware framework that loads different games, handles
* transitions and scoring
* ======================================================================== */



/* Variable Names */
var nGames, fenceContainer, totalScore, gamesPlayed, askQuestionNext;
gameOver = false;
gamesPlayed = 0;
askQuestionNext = false;
totalScore = 0;

var gameObjectsArray = [];

/* Function Names */
var invertWidthHeight, setupGameplayHandlers, nextGame, startGame1,
askQuestion, startGame2, startGame3, startGame4;

$(document).ready(function () {
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

  if (gamesPlayed === 5) { // Number should be variable later on
    gameOver = true;
    $('#canvas').remove();
    lastScreen();
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