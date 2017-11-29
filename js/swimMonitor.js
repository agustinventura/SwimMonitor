StyleEnum = {
	BRAZA: "Pecho",
	CROL: "Crol",
	ESPALDA: "Espalda",
	MARIPOSA: "Mariposa"
}

LengthEnum = {
	25: "25m",
	50: "50m"
}

var totalTimer = null;
var lengthTimer = null;

function init() {
	hideNonVisibleDivs();
    setInitialListeners();
}

function hideNonVisibleDivs() {
	$("#styleSelector").hide();
	$("#lengthSelector").hide();
	$("#trainingReady").hide();
	$("#currentTraining").hide();
	$("#pausedTraining").hide();
	$("#trainingSumUp").hide();
	$("#previousTrainings").hide();
}

function setInitialListeners() {
	setClickListener($("#showStyles"), showStyles);
	setClickListener($("#showPreviousTrainings"), showPreviousTrainings);
	/*$(document).on('rotarydetent', function(ev) {
		setsRotaryControl(ev);
	});*/
    $(window).on('tizenhwkey', function(e) {
    	backPressed(e);
    });
}

function backPressed(e) {
    var activeDivId = $('.clock:visible');
    if (e.originalEvent.keyName === 'back') {
        if (activePageId === 'initialScreen') {
            exit();
		} else if (activePageId === 'currentTraining'){
			reset();
        } else {
            history.back();
        }
    }
}

function reset() {
	training = null;
	clearInterval(lengthTimer);
	clearInterval(totalTimer);
	lengthTimer = null;
	totalTimer = null;
}

function exit() {
    tizen.application.getCurrentApplication().exit();
}

function getNewTraining() {
	var training = {
		selectedStyle: null,
		selectedLength: null,
		trainingDate: null,
		lengthCount: 1,
		totalSeconds: null,
		lengthSeconds: null,
		minLengthTime: null,
		maxLengthTime: null
	};
	return training;
}
function showStyles() {
	training = getNewTraining();
	$("#initialScreen").hide();
	createStylesList();
	setClickListener($(".style"), showLength);
	$("#styleSelector").show();
}

function setClickListener(element, listener) {
	element.off("click");
	element.click(listener);
}

function createStylesList() {
	var stylesList = $("#chooseStyle");
	stylesList.empty();
	for (var style in StyleEnum) {
		stylesList.append($('<li>').text(StyleEnum[style]).addClass('style'));
	}
}

function showPreviousTrainings() {
	$("#initialScreen").hide();
	$("#previousTrainings").show();
	var trainingsList = $("#trainings");
	trainingsList.empty();
	for (var i = 0; i < localStorage.length; i++) {
		trainingsList.append($('<li>').text(formatDate(new Date(localStorage.key(i)))).addClass('trainingItem'));
	}
	setClickListener($("#exitPreviousTrainings"), exitPreviousTrainings);
	setClickListener($(".trainingItem"), showPreviousTraining);
}

function exitPreviousTrainings() {
	$("#previousTrainings").hide();
	$("#initialScreen").show();
}

function showPreviousTraining() {
	var index = $(this).index();
	var trainingDate = localStorage.key(index);
	training = localStorage.getItem(trainingDate);
	$("#previousTrainings").hide();
	$("#previousTraining").show();
	$("#sumUpDate").html(formatDate(new Date(training.selectedStyle)));
	$("#sumUpStyle").html(StyleEnum[training.selectedStyle]);
	$("#sumUpLength").html(LengthEnum[training.selectedLength]);
	$("#sumUpTime").html(getFormattedTime(training.totalSeconds));
	$("#totalMeters").html(training.selectedLength*training.lengthCount);
	$("#bestTime").html(getFormattedTime(training.minLengthTime));
	$("#worstTime").html(getFormattedTime(training.maxLengthTime));
	$("#averageTime").html(getFormattedTime(training.totalSeconds/training.lengthCount));
	setClickListener($("#exitPreviousTraining"), exitPreviousTraining);
}

function exitPreviousTraining() {
	training = null;
	showPreviousTrainings();
}

function formatDate(date) {
  return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
}

function showLength() {
	var index = $(this).index();
    training.selectedStyle = Object.keys(StyleEnum)[index];
	$("#styleSelector").hide();
	createLengthList();
	setClickListener($(".length"), showTrainingReady);
	$("#lengthSelector").show();
}

function createLengthList() {
	var lengthsList = $("#chooseLength");
	lengthsList.empty();
	for (var length in LengthEnum) {
		lengthsList.append($('<li>').text(LengthEnum[length]).addClass('length'));
	}
}

function showTrainingReady() {
	var index = $(this).index();
    training.selectedLength = Object.keys(LengthEnum)[index];
	$("#lengthSelector").hide();
	$("#trainingReady").show();
	setClickListener($("#startTraining"), showCurrentTraining);
}

function showCurrentTraining() {
	$("#trainingReady").hide();
	$("#currentTraining").show();
	training.trainingDate = new Date();
	setClickListener($("#addLength"), newLength);
	setClickListener($("#pauseTraining"), pauseTraining);
	$("#selectedStyle").html(StyleEnum[training.selectedStyle]);
	$("#selectedLength").html(LengthEnum[training.selectedLength]);
	$("#lengthCount").text(training.lengthCount);
	training.totalSeconds = 0;
	totalTimer = setInterval(function () {
            refreshTotalSeconds();
        }, 1000);
	training.lengthSeconds = 0;
	lengthTimer = setInterval(function () {
            refreshLengthSeconds();
        }, 1000);
	training.minLengthTime = Number.MAX_VALUE;
	training.maxLengthTime = Number.MIN_VALUE;
}

function refreshTotalSeconds() {
	training.totalSeconds++;
	$("#totalTime").text(getFormattedTime(training.totalSeconds));
}

function getFormattedTime(seconds) {
	var hours   = Math.floor(seconds / 3600);
	var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
	var time = "";
	if (hours > 0) {
		if (hours < 10) {
			time = time.concat("0" + hours+ "h");
		} else {
			time = time.concat(hours+ "h");
		}
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	time = time.concat(minutes + "m");
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	time = time.concat(seconds+"s");
	return time;
}

function refreshLengthSeconds() {
	training.lengthSeconds++;
	$("#lengthTime").text(getFormattedTime(training.lengthSeconds));
}

function newLength() {
	training.lengthCount++;
	$("#lengthCount").text(training.lengthCount);
	if (training.lengthSeconds < training.minLengthTime) {
		training.minLengthTime = training.lengthSeconds;
	}
	if (training.lengthSeconds > training.maxLengthTime) {
		training.maxLengthTime = training.lengthSeconds;
	}
	clearInterval(lengthTimer);
	training.lengthSeconds = 0;
	$("#lengthTime").text(getFormattedTime(training.lengthSeconds));
	lengthTimer = setInterval(function () {
            refreshLengthSeconds();
        }, 1000);
}

function pauseTraining() {
	clearInterval(lengthTimer);
	clearInterval(totalTimer);
	lengthTimer = null;
	totalTimer = null;
	$("#currentTraining").hide();
	$("#pausedTraining").show();
	setClickListener($("#resumeTraining"), resumeTraining);
	setClickListener($("#endTraining"), endTraining);
}

function resumeTraining() {
	$("#pausedTraining").hide();
	$("#currentTraining").show();
	totalTimer = setInterval(function () {
            refreshTotalSeconds();
        }, 1000);
	lengthTimer = setInterval(function () {
            refreshLengthSeconds();
        }, 1000);
}

function endTraining() {
	if (lengthCount === 1) {
		training.minLengthTime = lengthSeconds;
		training.maxLengthTime = lengthSeconds;
	}
	localStorage.setItem(training.trainingDate, training);
	$("#pausedTraining").hide();
	$("#trainingSumUp").show();
	$("#sumUpStyle").html(StyleEnum[training.selectedStyle]);
	$("#sumUpLength").html(LengthEnum[training.selectedLength]);
	$("#sumUpTime").html(getFormattedTime(training.totalSeconds));
	$("#totalMeters").html(training.selectedLength*training.lengthCount);
	$("#bestTime").html(getFormattedTime(training.minLengthTime));
	$("#worstTime").html(getFormattedTime(training.maxLengthTime));
	$("#averageTime").html(getFormattedTime(training.totalSeconds/training.lengthCount));
	setClickListener($("#exitTraining"), exitTraining);
}

function exitTraining() {
	reset();
	$("#trainingSumUp").hide();
	$("#initialScreen").show();
}

$(document).ready(init);