var init = function() {
  var card = document.getElementById('card');
  
  document.getElementById('fence').addEventListener( 'click', function(){
    card.toggleClassName('flipped');
  }, false);
};

window.addEventListener('DOMContentLoaded', init, false);