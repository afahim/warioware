$( document ).ready(function() {

	window.scrollTo( 0, 1 );

	invertWidthHeight();

	var card = document.getElementById('card');

	var clicked = false;
	var fenceContainer = document.getElementById('fence-container');

	document.getElementById('right-card').addEventListener( 'click', function(){
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

	fenceContainer.addEventListener("webkitAnimationEnd", function(e){
		if(e.animationName === "pan-in") {
			$("#fence-container").hide();
		}
	}, false);

});

$( window ).resize(function() {
	invertWidthHeight();
});

function invertWidthHeight () {
	$("#right-card").height($(window).width());
	$("#right-card").width($(window).height());

	$("#left-card").height($(window).width());
	$("#left-card").width($(window).height());
}
