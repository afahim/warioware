/* ========================================================================
* Warioware: script.js v0.1
* https://github.com/afahim/warioware/
* ========================================================================
* Copyright 2014 Techbridgeworld, Inc.
* Developed for 15-239 (http://www.cs.cmu.edu/~./239/about/)
* ======================================================================== */

/* Variable Names */
var nGames, fenceContainer;

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
      nextGame();
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
function gameFinished() {
  $("#fence-container").css('visibility', '');
  fenceContainer.className = "lateral-back";
}

// Randomly selecting and displaying a minigame to the user
// ========================================================
function nextGame() {
  var gameIndex = Math.floor(Math.random() * nGames);
  $("#game-instance").html($("#game" + gameIndex).html());

  /* #ToDo: Remove hardcoded start game func and use game objs instead*/
  if (gameIndex === 0) {
    desertJump.startGame();
  } else if (gameIndex === 1) {
    askQuestion();
  } else if (gameIndex === 2) {
    startGame2();
  }
}