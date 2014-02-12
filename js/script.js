/*var init = function() {
  var card = document.getElementById('card');
  
  document.getElementById('fence').addEventListener( 'click', function(){
    card.className = card.className + " lateral-move";
  }, false);
};*/

var init = function() {
  var card = document.getElementById('fence-container');
  
  document.getElementById('fence-container').addEventListener( 'click', function(){
    card.className = card.className + " lateral-move";
  }, false);
};


window.addEventListener('DOMContentLoaded', init, false);