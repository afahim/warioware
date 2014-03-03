/* ========================================================================
* script.js v0.2
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Warioware framework that loads different games, handles
* transitions and scoring
* ======================================================================== */

/* Variable Names */
var nGames, fenceContainer, totalScore, gamesPlayed;
gameOver = false;
gamesPlayed = 0;
totalScore = 0;

/* Function Names */
var invertWidthHeight, setupGameplayHandlers, nextGame, startGame1,
  askQuestion, startGame2;

$(document).ready(function () {
  nGames = document.getElementById("all-games").children.length;
  fenceContainer = document.getElementById('fence-container');

  invertWidthHeight();
  setupGameplayHandlers();
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
  $("#fence-container").css('visibility', '');
  fenceContainer.className = "lateral-back";

  console.log(result);

  console.log(totalScore);
  /* updating score based on result */
  if (result === true) {
    totalScore += 100;
  }
  else {
    totalScore -= 50;
  }
  console.log(totalScore);
}

// Randomly selecting and displaying a minigame to the user
// ========================================================
function nextGame() {
  var gameIndex = Math.floor(Math.random() * nGames);
  //gameIndex = 0;
  $("#game-instance").html($("#game" + gameIndex).html());

  /* #ToDo: Remove hardcoded start game func and use game objs instead*/
  if (gameIndex === 0) {
    desertJump.startGame();
  } else if (gameIndex === 1) {
    askQuestion();
  } else if (gameIndex === 2) {
    startGame2();
  }
  gamesPlayed++;
  if (gamesPlayed === 5) { // Number should be variable later on
    gameOver = true;
  }
}

// Displays the score and any options for after the game has been played
// =====================================================================
// Needs to be implemented
function lastScreen() {
  console.log(totalScore);
  var scoreString = totalScore.toString();
  $("#scoreScreen").css('visibility', 'visible'); 
  $("#scoreScreen div").append(scoreString)
}