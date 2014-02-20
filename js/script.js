var nGames = 3;
var fenceContainer;

$( document ).ready(function() {
	fenceContainer = document.getElementById('fence-container');

	//inverting 
	invertWidthHeight();
	setupGameplayHandlers();

	//Choosing random game from list of choices and displaying to user
	nextGame();
});

function nextGame() {
	var gameIndex = Math.floor(Math.random() * nGames);
	$("#game-instance").html( $("#game" + gameIndex).html() );
	if (gameIndex == 0) {
		startGame1();
	}
}

function gameFinished() {
	//$("#fence-container").show();
	$("#fence-container").css('visibility', '');
	fenceContainer.className = "lateral-back";
}

$( window ).resize(function() {
	invertWidthHeight();
});

function invertWidthHeight () {
	$("#right-card").height($(window).width());
	$("#right-card").width($(window).height());

	$("#left-card").height($(window).width());
	$("#left-card").width($(window).height());
}

function setupGameplayHandlers() {
	var card = document.getElementById('card');

	fenceContainer.addEventListener("webkitAnimationEnd", function(e){
		if(e.animationName === "pan-in") {
			$("#fence-container").css('visibility', 'hidden');
		}
		else if (e.animationName === "knock-over") {
			fenceContainer.className = "lateral-move";
		}
		else if (e.animationName === "pan-out") {
			$(".door-holder").removeClass("not-slided");
			$(".door-holder").addClass("slided");
		}
		else if (e.animationName === "slidein-left-door") {
			nextGame();
			$(".door-holder").removeClass("slided");
			$(".door-holder").addClass("not-slided");
		}
		else if (e.animationName === "slideout-left-door") {

			fenceContainer.className = "lateral-move";
		}
	}, false);

	var clicked = false;

	document.getElementById('right-card').addEventListener('click', function(){
		if (clicked == false) {
			fenceContainer.className = "lateral-move";
			clicked = true;
		} else {
			fenceContainer.className = "lateral-back";
			clicked = false;
		}
	}, false);

	document.getElementById('card').addEventListener( 'click', function(){
		card.className = card.className + " flipped";
	}, false);

	document.getElementById('top-card').addEventListener('click', function(){
		$(".door-holder").removeClass("not-slided");
		$(".door-holder").addClass("slided");
	})

	document.getElementById('left-door').addEventListener('click', function(){
		$(".door-holder").removeClass("slided");
		$(".door-holder").addClass("not-slided");
	})

	document.getElementById('right-door').addEventListener('click', function(){
		$(".door-holder").removeClass("slided");
		$(".door-holder").addClass("not-slided");
	})	
}
