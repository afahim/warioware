/* =======================================================================
* Question Screen v0.1
* Written by millerEric, afainitObjhim, mturnshek, nail60
* ========================================================================
* Summary: Asks the user a random question, 
* randomly scrambling the answer choices.
* ======================================================================== */


///////////////////// Make Question /////////////////////////
function askQuestion() {

	//questionIndex = 8;
	// Get the question object for the next question
	var question = initObj.questions[questionIndex];

	// array to keep track of answers chosen
	answersChosen = [];
	
	var timeInterval;

	// Set this to false if the player answers incorrectly
	var playerWins = true;

	// Display the new question prompt
	clearQuestion();
	displayQuestion(question);

	// Display the answer choices, depending on question type.
	if (question.type === "MULTIPLE_CHOICE") {
		function isCorrect(element) {
			return element.correct;
		}
		
		var answersToDisplay = [];
		var correctAnswers = question.possibleAnswers.filter(isCorrect);
		var chosenCorrectAnswer = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
		answersToDisplay.push(chosenCorrectAnswer);

		for (var i = 0; i < question.possibleAnswers.length; i++){
			displayAnswer(question, i);
		}
		// Attach event handlers for answer choices.
		attachAnswerEvents();
	} 
	else if (question.type === "SHORT_ANSWER") {
		var answerBlank = $("<div>Answer: <input type='text' name='answer'></div>");
		answerBlank.addClass("answer");
		answerBlank.addClass("blank");
		$("#questionScreen").append(answerBlank);
	}
	else if (question.type === "ALL_THAT_APPLY") {
	
	  /* Currently, we are doing exactly the same thing for multiple choice and 
	     all that apply questions. */
	     
		function isCorrect(element) {
			return element.correct;
		}
		
		var answersToDisplay = [];
		var correctAnswers = question.possibleAnswers.filter(isCorrect);
		var chosenCorrectAnswer = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
		answersToDisplay.push(chosenCorrectAnswer);

		for (var i = 0; i < question.possibleAnswers.length; i++){
			displayAnswer(question, i);
		}
		// Attach event handlers for answer choices.
		attachAnswerEvents();
	}

	// Clears last question and its answers from the DOM
	function clearQuestion(){
		$('#questionPrompt').empty();
		$(".answer").remove();
	}

	// Display question text and/or load resource
	function displayQuestion(question){
	  
		if (question.text !== undefined){
			var questionText = $("<div>");
			questionText.attr("id", "questionText");
			questionText.html(question.text);
			$("#questionPrompt").append(questionText);
		}
		if (question.questionResourceId !== undefined){
			displayResource(question.questionResourceId, "questionResource");
		}
	}

	// Display answer text and/or load answer resource
	// Takes a unique identifier for the answer DOM object.
	function displayAnswer(question, answerIndex){
		var answer = question.possibleAnswers[answerIndex];
		var answerOption = $("<div>");
		answerOption.attr("answerIndex", answerIndex.toString()); // Store answer id, which we use to identify it on click.
		answerOption.addClass("answer");
		if (answer.correct){
			answerOption.addClass("correct");
		}
		else{
			answerOption.addClass("incorrect");
		}
		if (answer.text !== undefined) {
			answerOption.html(answer.text)
		}
		$("#questionScreen").append(answerOption);
		if (answer.resourceId !== undefined){
			displayResource(answer.resourceId, "answerResource", answerIndex);
		}
	}

	// Finds and displays resource to page
	function displayResource(id, type, index) {
		var resource;
		// Search the initObj for the resource of this id.
		for (var resourceId in initObj.resources){
			if (initObj.resources.hasOwnProperty(resourceId) && resourceId == id){
				resource = initObj.resources[id];
				break; 
			}
		}
		
		// div for the main resources
		var resourceContainer = $("<div>"); 
		if (type === "questionResource"){
			resourceContainer.attr("id", "questionResource");
			$("#questionPrompt").append(resourceContainer);
		}
		else if (type === "answerResource"){
			resourceContainer.addClass("answerResource");
			ansText = question.possibleAnswers[index].text;
			$("[answerIndex="+index+"]").append(resourceContainer);
		}

		// Check resource type and add element to DOM
		// Use makeMediaUrl to correctly format the src tag
		if (resource.type === "IMAGE"){
			var image = $("<img>");
			image.attr("src", resource.url);
			image.attr("type", resource.mimeType);
			// If the image resource will be displayed in the question box, make
			// it a clickable icon.  If it will be displayed in the answer box, make
			// the image fill the whole box.
			if (type == 'questionResource') {
				image.addClass("resourceIcon");
				// make the expanded image but in the background
				var imageBig = $("<img>");
				imageBig.attr("src", resource.url);
				imageBig.attr("type", resource.mimeType);
				imageBig.addClass("resourceImageBig");
				imageBig.attr("id", "resourceBig"+index);
				$(resourceContainer).append(imageBig);	
			}
			else {
				// If there is no text, use whole image.
				// If there is text, split answer box in half (text/image).
				if (ansText == null) {
					image.addClass("answerImageFull");
				}
				else {
					image.addClass("answerImageHalf");
				}
			}
			image.attr("imgIndex", index);
			resourceContainer.append(image);
		}
		else if (resource.type === "AUDIO") {
			var audio = $("<audio>");
			//audio.addClass("resourceAudio");
			audio.attr("src", resource.url);
			audio.attr("type", resource.mimeType);
			resourceContainer.append(audio);
			audio.load();
			// show the audio icon in the corner
			var audioImage = $("<div>");
			$(audioImage).addClass('audioImage');
			resourceContainer.append(audioImage);
			// bind clicking this image to playing the resource
			$(audioImage).click(function() {
				audio[0].play();
				$("[answerIndex="+index+"]").toggleClass("ans-selected");
			});
		}
		else if (resource.type === "VIDEO"){
			var video = $("<video controls>");
			video.addClass("resourceIconVideo");
			var source = $("<source>");
			source.attr("src", resource.url);
			source.attr("type", resource.mimeType);
			video.append(source);
			resourceContainer.append(video);
			// make the expanded video in the background, starts out hidden but appears
			// when user clicks on the icon
			// var videoBig = $("<video controls>");
// 			videoBig.attr("src", resource.url);
// 			videoBig.attr("type", resource.mimeType);
// 			var sourceBig = $("<source>");
// 			sourceBig.attr("src", resource.url);
// 			sourceBig.attr("type", resource.mimeType);
// 			videoBig.append(sourceBig);
// 			resourceContainer.append(videoBig);
// 			videoBig.attr("id", "resourceBig"+index);
// 			videoBig.addClass("videoBig");
// 			$('#questionScreen').append(resourceContainer);
	  }
	}

	// Click event for each answer option
	function attachAnswerEvents(){
		$('.answer').click(function() {
			$(this).toggleClass("ans-selected");
		});
	}

	
	//////////// Answer Event Handlers /////////////////

	function processAnswer(questionId, choice, correct, timeTaken) {
		var answerObj = makeAnswer(questionId, choice, correct, timeTaken);
		if (answerObj !== undefined) {
			answersChosen.push(answerObj);
		}
		if (questionIndex == initObj.questions.length - 1) {
			// All questions are answered! POST to server.
			console.log('sending answers...');
			addStudentAnswers(answersChosen, timeTaken, function(data) { console.log(data);} )
		}
	}

	function correctAnswerHandler(answerId){
		var questionId = question._id;
		var choice = question.possibleAnswers[parseInt(answerId)];
		console.log(choice);
		var timeElapsed = 0;
		// Change color of this answer button to green
		$('[answerIndex='+answerId+']').addClass('ans-correct');

		// Save the student's answer
		processAnswer(questionId, choice, true, timeElapsed);
	}


	function incorrectAnswerHandler(answerId){
		playerWins = false;
		var questionId = question._id;
		var choice = question.possibleAnswers[parseInt(answerId)];
		var correctChoice = choice.correct;
		var timeElapsed = 0;
		if (choice.correct === false) {
			// Change color of this answer button to red
			$('[answerIndex='+answerId+']').addClass('ans-incorrect');
		}

		// Save the student's answer
		processAnswer(questionId, choice, false, timeElapsed);
	}

	function shortAnswerHandler(event) {
		event.preventDefault();
		var text = $("input").val();
		var choice = { text : text , correct : false};
		var questionId = initObj.questions[questionIndex]._id;
		var timeElapsed = 0;
		playerWins = false;  // set to true if they entered the correct text

		var possibleAnswers = initObj.questions[questionIndex].possibleAnswers;
		for (var i = 0; i < possibleAnswers.length; i++) {
			if (possibleAnswers[i].text === text) {
				// Correct answer
				choice.correct = true;
				playerWins = true;
				break;
			}
		}

		processAnswer(questionId, choice, choice.correct, timeElapsed);
	}

	// Click handler for the submit button
	$('#submit').click(function() {
		$('.resourceImageBig').remove();		
		// Process selected answers as correct or incorrect	
		var answers = $(".answer");
		for (var i = 0; i < answers.length; i++){
			var thisAnswer = $("[answerindex = '"+ i + "']");
			if ($(thisAnswer).hasClass("correct") && $(thisAnswer).hasClass("ans-selected")) {
				correctAnswerHandler(i);
			} else if ($(thisAnswer).hasClass("incorrect") && $(thisAnswer).hasClass("ans-selected")) {
				// player loses if they select an incorrect answer choice
				incorrectAnswerHandler(i);
				playerWins = false;
			} else if ($(thisAnswer).hasClass("correct") && !($(thisAnswer).hasClass("ans-selected"))) {
				// player loses if they don't select all correct answers
				incorrectAnswerHandler(i);
				playerWins = false;  
			}
	 	}
	 	if (answers.length === 1 && $(answers[0]).hasClass("blank")) {
	 		var submit = $(".submitButton");
	 		submit.click(shortAnswerHandler);
	 	}

	 	// Clear the question and send answers to the server
		questionIndex += 1;
	 	// Finish the question screen
	 	if (playerWins === true) {
			gameFinished(true);
		} else {
			gameFinished(false);
		}
		// unbind the submit click handler
		$(this).unbind('click');
	});

	// Handlers for dealing dealing with image resources
	// ---------------------------------------------------
	// make clicking the thumbnail image either show or hide the expanded image
	var imageIsExpanded = false;
	$('.resourceIcon').click(function() {
		imgIndex = $(this).attr("imgIndex");
		bigImage = document.getElementById("resourceBig"+imgIndex);
		if (imageIsExpanded === true) {
			$(bigImage).fadeOut(250);
			$(bigImage).css("visibility", "hidden");
			imageIsExpanded = false;
		}
		else {
			$(bigImage).css("visibility", "visible");
			$(bigImage).fadeIn(250);
			imageIsExpanded = true;
		}
	});
	// make clicking the expanded image remove the expanded image
	$('.resourceImageBig').click(function() {
		$(this).fadeOut(250);
		$(this).css("visibility", "hidden");
		imageIsExpanded = false;
	});	

}