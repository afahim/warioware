// sample callback 
var info;

function foo(data){
    console.log(data);
    info = data;
}

var SERVER_HOST = "http://techcafe-server.herokuapp.com"
//var SERVER_HOST = "http://localhost:3000";
var TechCafe = {};

function init(callback, developerId, testing){

    // If testing === false, REQUIRES : window.location.search = http://......?asstId=...&gameId=....&studentId=....
    var query = parseQueryString(window.location.search.substring(1));
    var asstId = query.asstId;
    var gameId = query.gameId;
    var studentId = query.studentId;

    $.ajax({
        type: "get",
        url: SERVER_HOST + "/init",
        data : {
            asstId : asstId,
            gameId : gameId,
            studentId : studentId,
            testing: testing,
            developerId: developerId
        },
        success: function (data) {
            // v0.3 Temp measure to fix media URLs.
            if (data !== undefined && data.initObj !== undefined) {
                var resources = data.initObj.resources;
                for (var resource in resources) {
                    if (resources.hasOwnProperty(resource)) {
                        resources[resource].url = makeMediaUrl(resources[resource].url);
                    }
                }
            }
            TechCafe.initObj = data.initObj;
            callback(data);
        }
    });
}

function addStudentAnswers(answers, timeElapsed, callback){

    if (answers === undefined ||
        !isArray(answers)) {
        console.log("Answers is not an array or undefined, answer not sent.");
        return;
    }

    for (var i = 0; i < answers.length; i++) {
        if (!isValidAnswer(answers[i])) {
            console.log("Answer not sent.");
            return;
        }        
    }

    $.ajax({
        type: "post",
        url: SERVER_HOST + "/answers",
        data: {
            answers:answers,
            timeElapsed: timeElapsed
        },
        success: function(data){
            callback(data);
        }
    });
}

function updateGameData(gameData, callback){
    $.ajax({
        type: "put",
        url: SERVER_HOST + "/gameData",
        data: {
            gameData: gameData
        },
        success: function(data){
            callback(data);
        }
    });
}

function getGameData(gameId, studentId, callback) {
    $.ajax({
        type: "get",
        url: SERVER_HOST + "/gameData",
        data: {
            gameId: gameId,
            studentId : studentId
        },
        success: function(data) {
            callback(data);
        }
    });
}

/********************************  Helpers  *************************************/

// From http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

function isValidAnswer(answer) {

    var valid = true;

    console.log(answer);

    function isValidHexString(hs) {
        return (hs !== undefined) &&
               (typeof(hs) === "string") && 
               (!isNaN(parseInt(hs, 16))) &&
               hs.length === 24;
    }

    function validChoices(choice) {
        for (var i = 0; i < choice.length; i++) {
            if (choice[i].text === undefined && choice[i].resourceId === undefined) {
                return false;
            }
        }
        return true;
    }

    if (answer.choice === undefined || 
        !isArray(answer.choice) ||
        !validChoices(answer.choice)) {
        console.log("Answer choice not formatted correctly");
        valid = false;
    }
    if (!isValidHexString(answer.studentId)) {
        console.log("studentId not formatted correctly");
        valid = false;
    }
    if (!isValidHexString(answer.questionId)) {
        console.log("questionId not formatted correctly");
        valid = false;
    }
    if (!isValidHexString(answer.assignmentId)) {
        console.log("assignmentId is not formatted correctly");
        valid = false;
    }
    if (answer.correct === undefined || typeof(answer.correct) !== "boolean") {
        console.log("correct not formatted correctly");
        valid = false;
    }
    if (answer.timeTaken === undefined || typeof(answer.timeTaken) !== "number") {
        console.log("timeTaken not formatted correctly");
        valid = false;
    }

    return valid;
}

function makeAnswer(questionId, choice, correct, timeTaken){

    if (choice !== undefined && !isArray(choice)) {
        choice = [choice];
    }

    var answer = {
        studentId : TechCafe.initObj.studentId,
        questionId : questionId,
        assignmentId : TechCafe.initObj.assignmentId, 
        dateAttempted : new Date(),
        choice : choice,
        correct : correct,
        timeTaken : timeTaken
    };
    
    if (isValidAnswer(answer)) {
        return answer;
    } 

    console.log("An answer object will not be made.");
}

// From http://www.joezimjs.com/javascript/3-ways-to-parse-a-query-string-in-a-url/
function parseQueryString (queryString){
    var params = {}, queries, temp, i, l;
 
    // Split into key/value pairs
    queries = queryString.split("&");
 
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
 
    return params;
};

// Takes the url from a resource object and construct a media url from it.
function makeMediaUrl ( resourceUrl ) {
    return SERVER_HOST + "/media/" + resourceUrl;
}