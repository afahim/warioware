/* =======================================================================
* Question Screen v0.1
* Written by millerEric, afahim, mturnshek, nail60
* ========================================================================
* Summary: Asks the user a random question, 
* randomly scrambling the answer choices.
* ======================================================================== */


// Object constructor for new questions
// ===================================================
function Question(id, text, correctAnswers, incorrectAnswers) {
	this.id = id;
	this.text = text;
	this.correctAnswers = correctAnswers;
	this.incorrectAnswers = incorrectAnswers;
}

// Main Function for choosing and asking the question
// ===================================================
function askQuestion() {
	// Question 1 Data
	var text1 = 'I ___ learning.';
	var correctAns1 = ['am'];
	var incorrectAns1 = ['is', 'are', 'were'];
	var question1 = new Question(1, text1, correctAns1, incorrectAns1);
	// Question 2 Data
	var text1 = 'We ___ having fun.';
	var correctAns1 = ['are'];
	var incorrectAns1 = ['is', 'be', 'am'];
	var question2 = new Question(1, text1, correctAns1, incorrectAns1);
	// Question 3 Data
	var text1 = '5 + 5 = ___';
	var correctAns1 = ['10'];
	var incorrectAns1 = ['9', '0', '11'];
	var question3 = new Question(1, text1, correctAns1, incorrectAns1);
	var allQuestions = [question1, question2, question3];

	// Randomly choose a question
	var randIndex = Math.floor(Math.random() *  allQuestions.length);
	var question = allQuestions[randIndex];
	document.getElementById("questionPrompt").innerHTML = question.text;

	// Randomly choose which button will hold the correct answer
	var correctIdx = Math.floor((Math.random()*4)+1);
	j = 0;
	for (i=1; i<5; i++) {
		number = i.toString();
		element = "ans".concat(number);
		if (number == correctIdx) {
			document.getElementById(element).innerHTML = question.correctAnswers[0];
		}
		else {
			document.getElementById(element).innerHTML = question.incorrectAnswers[j];
			j += 1;
		}
	}

	// Check whether the button pressed was the correct or incorrect answer
	$('#ans1').click(function() {
		if (correctIdx == 1) {
			gameFinished();
		}
		else {
			gameFinished();
		}	
	});
	$('#ans2').click(function() {
		if (correctIdx == 2) {
			gameFinished();
		}
		else {
			gameFinished();
		}	
	});
	$('#ans3').click(function() {
		if (correctIdx == 3) {
			gameFinished();
		}
		else {
			gameFinished();
		}	
	});
	$('#ans4').click(function() {
		if (correctIdx == 4) {
			gameFinished();
		}
		else {
			gameFinished();
		}	
	});
}
