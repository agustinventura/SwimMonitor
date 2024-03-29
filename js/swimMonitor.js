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
var previousTrainingIndex = null;
var listElement = 0;

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
	$("#previousTraining").hide();
	$("#previousTrainingOptions").hide();
}

function setInitialListeners() {
	setClickListener($("#showStyles"), showStyles);
	setClickListener($("#showPreviousTrainings"), showPreviousTrainings);
	$(window).off('tizenhwkey');
    $(window).on('tizenhwkey', function(e) {
    	backPressed(e);
    });
	setRotaryListener(initialScreenNavigation);
}

function initialScreenNavigation(ev) {
	var direction = ev.detail.direction;
    if (direction === "CW") {
        showStyles();
    } else {
        showPreviousTrainings();
    }
}

function backPressed(e) {
    var activeDivId = $('.clock:visible').not(":hidden").prop("id")
    if (e.originalEvent.keyName === 'back') {
		goBack(activeDivId);
    }
}

function goBack(activeDivId) {
	switch (activeDivId) {
		case "initialScreen":
			exit();
			break;
		case "styleSelector":
			training = null;
			$("#styleSelector").hide();
			$("#initialScreen").show();
			break;
		case "lengthSelector":
			training.selectedStyle = null;
			$("#lengthSelector").hide();
			$("#styleSelector").show();
			break;
		case "trainingReady":
			training.selectedLength = null;
			$("#trainingReady").hide();
			$("#lengthSelector").show();
			break;
		case "currentTraining":
			$("#currentTraining").hide();
			$(document).off('rotarydetent');
			$("#trainingReady").show();
			training.trainingDate = null;
			$("#selectedStyle").html("");
			$("#selectedLength").html("");
			$("#lengthCount").text("");
			training.totalSeconds = 0;
			clearInterval(totalTimer)
			totalTimer = null;
			training.lengthSeconds = 0;
			clearInterval(lengthTimer);
			lengthTimer = null;
			training.minLengthTime = Number.MAX_VALUE;
			training.maxLengthTime = Number.MIN_VALUE;
			break;
		case "pausedTraining":
			resumeTraining();
			break;
		case "trainingSumUp":
			exitTraining();
			break;
		case "previousTrainings":
			exitPreviousTrainings();
			break;
		case "previousTraining":
			exitPreviousTraining();
			break;
		case "previousTrainingOptions":
			$("#previousTrainingOptions").hide();
			$("#previousTraining").show();
			break;
	}
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
	$(document).off('rotarydetent');
	$("#initialScreen").hide();
	createStylesList();
	setClickListener($(".style"), showLength);
	$("#styleSelector").show();
}

function setClickListener(element, listener) {
	element.off("click");
	element.click(listener);
}

function setRotaryListener(listener) {
	$(document).off('rotarydetent');
	$(document).on('rotarydetent', listener);
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
	listElement = 1;
	trainingsList.empty();
	for (var i = 0; i < localStorage.length; i++) {
		trainingsList.append($('<li>').text(formatDate(new Date(localStorage.key(i)))).addClass('trainingItem'));
	}
	setClickListener($("#exitPreviousTrainings"), exitPreviousTrainings);
	setClickListener($(".trainingItem"), showPreviousTraining);
	setRotaryListener(scrollItems);
}

function scrollItems(ev) {
	var direction = ev.detail.direction;
    if (direction === "CW") {
		if (listElement < localStorage.length) {
			$('.scrollableList').animate(
				{
					scrollTop: $('.trainings li:nth-child('+ listElement + ')').position().top - $('.trainings li:first').position().top
				}, 
				'slow');
			listElement++;
		}
    } else {
    	if (listElement > 0) {
    		$('.scrollableList').animate(
    				{
    					scrollTop: $('.trainings li:nth-child('+ listElement + ')').position().top - $('.trainings li:first').position().top
    				}, 
    				'slow');
    		if (listElement > 1) {
    			listElement--;
    		}
    	}
    }
}

function exitPreviousTrainings() {
	$("#initialScreen").show();
	init();
}

function showPreviousTraining() {
	previousTrainingIndex = $(this).index();
	var trainingDate = localStorage.key(previousTrainingIndex);
	var JSONtraining = localStorage.getItem(trainingDate);
	training = JSON.parse(JSONtraining);
	$(document).off('rotarydetent');
	$("#previousTrainings").hide();
	$("#previousTraining").show();
	$("#trainingDay").html(formatDay(new Date(training.trainingDate)));
	$("#trainingHour").html(formatHour(new Date(training.trainingDate)));
	$("#trainingStyle").html(StyleEnum[training.selectedStyle]);
	$("#trainingLength").html(LengthEnum[training.selectedLength]);
	$("#trainingTime").html(getFormattedTime(training.totalSeconds));
	$("#trainingTotalMeters").html(training.selectedLength*training.lengthCount);
	$("#trainingBestTime").html(getFormattedTime(training.minLengthTime));
	$("#trainingWorstTime").html(getFormattedTime(training.maxLengthTime));
	$("#trainingAverageTime").html(getFormattedTime(training.totalSeconds/training.lengthCount));
	setClickListener($("#showPreviousTrainingOptions"), showPreviousTrainingOptions);
}

function formatDay(date) {
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	var month = date.getMonth();
	if (month < 10) {
		month = '0' + month;
	}
	var year = date.getFullYear();
	return day + "/" + month + "/" + year;
}

function formatHour(date) {
	var hours = date.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	return hours + ':' + minutes;
}

function formatDate(date) {
  return formatDay(date) + ' ' + formatHour(date);
}

function showPreviousTrainingOptions() {
	$("#previousTraining").hide();
	$("#previousTrainingOptions").show();
	setClickListener($("#deletePreviousTraining"), deletePreviousTraining);
	setClickListener($("#exitPreviousTraining"), exitPreviousTraining);
}

function deletePreviousTraining() {
	var trainingDate = localStorage.key(previousTrainingIndex);
	localStorage.removeItem(trainingDate);
	exitPreviousTraining();
}

function exitPreviousTraining() {
	training = null;
	previousTrainingIndex = null;
	$("#previousTrainingOptions").hide();
	showPreviousTrainings();
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
	$(document).off('rotarydetent');
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
	training.lengthCount = 1;
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
	setRotaryListener(newLength);
}

function refreshTotalSeconds() {
	training.totalSeconds++;
	$("#totalTime").text(getFormattedTime(training.totalSeconds));
}

function getFormattedTime(seconds) {
	var hours   = Math.floor(seconds / 3600);
	var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
	if (seconds % 1 != 0) {
		seconds = seconds.toFixed(2);
	}
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
	$(document).off('rotarydetent');
	if (training.lengthCount === 1) {
		training.minLengthTime = training.lengthSeconds;
		training.maxLengthTime = training.lengthSeconds;
	}
	var jsonTraining = JSON.stringify(training);
	localStorage.setItem(training.trainingDate, jsonTraining);
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
	training = null;
	$("#initialScreen").show();
	init();
}

$(document).ready(init);