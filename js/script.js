var nGames = 3;
var fenceContainer;


$( document ).ready(function() {
	fenceContainer = document.getElementById('fence-container');

	//inverting 
	invertWidthHeight();
	setupTestingHandlers();

	//Choosing random game from list of choices and displaying to user
	var gameIndex = Math.floor(Math.random() * nGames);
	console.log("game index is " + gameIndex);
	console.log($("#game" + gameIndex).html());
	$("#game-instance").html( $("#game" + gameIndex).html() );
});

function gameFinished() {
	$("#fence-container").css("display", "block");
	//fenceContainer.className = "lateral-move";

	/*$(".door-holder").removeClass("not-slided");
	$(".door-holder").addClass("slided");

	var gameIndex = Math.floor(Math.random() * nGames);
	$("#game-instance").html() = $("#game" + gameIndex).html();

	$(".door-holder").removeClass("slided");
	$(".door-holder").addClass("not-slided");

	fenceContainer.className = "lateral-back";*/
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

function setupTestingHandlers() {
	var card = document.getElementById('card');

	fenceContainer.addEventListener("webkitAnimationEnd", function(e){
		if(e.animationName === "pan-in") {
			$("#fence-container").css('display', 'hidden');
			console.log("hidden is " + $("#fence-container").css('display'));
		}
	}, false);

	var clicked = false;

	document.getElementById('right-card').addEventListener('click', function(){
		console.log("right carded");
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
		console.log("hidden");
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
