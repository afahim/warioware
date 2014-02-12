/*var init = function() {
  var card = document.getElementById('card');
  
  document.getElementById('fence').addEventListener( 'click', function(){
    card.className = card.className + " lateral-move";
  }, false);
};*/

$( document ).ready(function() {
	$("#right-card").height($(window).width());
	$("#right-card").width($(window).height());

	$("#left-card").height($(window).width());
	$("#left-card").width($(window).height());

	var card = document.getElementById('card');
	var fenceContainer = document.getElementById('fence-container');

	document.getElementById('game-instance').addEventListener( 'click', function(){
		console.log("game instance");
		fenceContainer.className = card.className + " lateral-move";
	}, false);

	document.getElementById('card').addEventListener( 'click', function(){
		card.className = card.className + " flipped";
	}, false);

});

window.onresize = function(event) {
	$("#right-card").height($(window).width());
	$("#right-card").width($(window).height());

	$("#left-card").height($(window).width());
	$("#left-card").width($(window).height());
};
