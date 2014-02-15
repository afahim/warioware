$( document ).ready(function() {
	invertWidthHeight();
	var card = document.getElementById('card');

	var clicked = false;

	document.getElementById('game-instance').addEventListener( 'click', function(){
		var fenceContainer = document.getElementById('fence-container');
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

	var doorClicked = false;

	document.getElementById('top-card').addEventListener('click', function(){
		if (doorClicked == false) {
			document.getElementById('left-door').className = "slided";
			document.getElementById('right-door').className = "slided";
			doorClicked = true;
		} else {
			document.getElementById('left-door').className = "not-slided";
			document.getElementById('right-door').className = "not-slided";
			doorClicked = false;
		}
	})

});

window.onresize = function(event) {
	invertWidthHeight();
};

function invertWidthHeight () {
	$("#right-card").height($(window).width());
	$("#right-card").width($(window).height());

	$("#left-card").height($(window).width());
	$("#left-card").width($(window).height());

	$("#left-door").height($(window).width());
	$("#left-door").width($(window).height());

	$("#right-door").height($(window).width());
	$("#right-door").width($(window).height());
}
