/* =======================================================================
* Question Screen v0.1
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Asks the user a random question, 
* randomly scrambling the answer choices.
* ======================================================================== */


// Object constructor for new questions
// ==========================================================
function Question(id, text, answers, audioResources) {
	this.id = id;
	this.text = text;
	this.answers = answers
	this.audioResources = audioResources;
}

// Functions for using question resources
// In prototyping stage currently
// =======================================

function Resource(url) {
	this.url = url;
}

var demo1 = new Resource("audio/birdFlap.wav");
var demo2 = new Resource("audio/note1.mp3");
var demo3 = new Resource("audio/note2.mp3");
var demo4 = new Resource("audio/note3.mp3");
var demo5 = new Resource("audio/birdCollide.wav");

// The idea here is that there is a singular audio element, and it is played
// when a resource is clicked.
var currentAudioResource = document.createElement('audio');

function playAudioResource(resource) {
	currentAudioResource.pause(); // Stops if another is playing, else nothing
	currentAudioResource.src = resource.url;
	currentAudioResource.load();
	currentAudioResource.play();
}

// Main Function for choosing and asking the question
// ===================================================
function askQuestion() {
	//$('#submit').removeClass('submit-selected');
    $('.ans').each(function() {
		$(this).removeClass('ans-selected');
	});		
	// Question 1 Data
	var text1 = 'I ___ learning.';
	var ans = ['am', 'is', 'are', 'were'];
	var audioResources = [demo1, demo2, demo3, demo4, demo5];
	var question1 = new Question(1, text1, ans, audioResources);
	// Question 2 Data
	var text1 = 'We ___ having fun.';
	var ans = ['are', 'is', 'be', 'am'];
	var audioResources = [demo1, demo2, demo3, demo4, demo5];
	var question2 = new Question(1, text1, ans, audioResources);
	// Question 3 Data
	var text1 = '5 + 5 = ___';
	var ans = ['10', '9', '0', '11'];
	var audioResources = [demo1, demo2, demo3, demo4, demo5];
	var question3 = new Question(1, text1, ans, audioResources);
	
	var allQuestions = [question1, question2, question3];

	// Randomly choose a question
	var randIndex = Math.floor(Math.random() *  allQuestions.length);
	var question = allQuestions[randIndex];
	var t = document.createElement('div');
	t.id = "questionText";
	t.innerHTML = question.text;
	document.getElementById("questionPrompt").appendChild(t);

	/* Randomly assign answers to buttons
	var idx = Math.floor((Math.random()*choicesLeft)+1); 
	*/

	for (i=1; i<5; i++) {
		number = i.toString();
		element = "ans".concat(number);		
		var t = document.createElement('div');
		t.innerHTML = question.answers[i-1];
		t.id = "answerText" + i;
		t.className = "ansText";
		document.getElementById(element).appendChild(t);
	}
	
	$('.audioImage').click(function() {
		/* Clicking the audio image also clicks the answer card, so we have to 
		   un-select it in this case. */
		var id = $(this).attr('id');
		var parentAnswer = this.parentNode;
		var parentID = $(parentAnswer).attr('id');
		if (parentID != "questionPrompt") {
			$(parentAnswer).toggleClass("ans-selected");
			var idNum = parseInt(id.slice(-1));
		}
		else {
			var idNum = 0;
		}
		var res = question.audioResources[idNum];
		playAudioResource(res);
	});
	
	$('#submit').click(function() {
		$(this).addClass('submit-selected');
		$('.ans').unbind();
		$('#questionText').remove();
		for (i=1; i<5; i++) {
			var elId = '#answerText' + i;
			$(elId).remove();
		}
		if (true) {
			gameFinished(true);
		} else {
			gameFinished(false);
		}
	});
	
	// Handler for answer choices being selected
	// =========================================
	$('.ans').click(function() {
		console.log("answer clicked: " + this.className);
		$(this).toggleClass("ans-selected");
	});
	
	$('#questionAudio').click(function() {
		playAudioResource(demo);
	});
}


