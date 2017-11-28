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

var selectedStyle = null;
var selectedLength = null;
var lengthCount = 1;
var totalTimer = null;
var lengthTimer = null;
var totalSeconds = null;
var lengthSeconds = null;

function init() {
	hideNonVisibleDivs();
    setInitialListeners();
}

function hideNonVisibleDivs() {
	$("#styleSelector").hide();
	$("#lengthSelector").hide();
	$("#trainingReady").hide();
	$("#currentTraining").hide();
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
	lengthCount = 1;
	totalTimer = null;
	lengthTimer = null;
	totalSeconds = null;
	lengthSeconds = null;
}

function exit() {
    tizen.application.getCurrentApplication().exit();
}

function showStyles() {
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
	stylesList.attr('size', Object.keys(StyleEnum).length);
}

function showPreviousTrainings() {
	$("#initialScreen").hide();
	$("#showPreviousTrainings").show();
}

function showLength() {
	var index = $(this).index();
    selectedStyle = Object.keys(StyleEnum)[index];
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
	lengthsList.attr('size', Object.keys(LengthEnum).length);
}

function showTrainingReady() {
	var index = $(this).index();
    selectedLength = Object.keys(LengthEnum)[index];
	$("#lengthSelector").hide();
	$("#trainingReady").show();
	setClickListener($("#startTraining"), showCurrentTraining);
}

function showCurrentTraining() {
	$("#trainingReady").hide();
	$("#currentTraining").show();
	setClickListener($("#addLength"), newLength);
	setClickListener($("#pauseTraining"), pauseTraining);
	$("#selectedStyle").html(StyleEnum[selectedStyle]);
	$("#selectedLength").html(LengthEnum[selectedLength]);
	totalSeconds = 0;
	totalTimer = setInterval(function () {
            refreshTotalSeconds();
        }, 1000);
	lengthSeconds = 0;
	lengthTimer = setInterval(function () {
            refreshLengthSeconds();
        }, 1000);
}

function refreshTotalSeconds() {
	totalSeconds++;
	$("#totalTime").text(getFormattedTime(totalSeconds));
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
	lengthSeconds++;
	$("#lengthTime").text(getFormattedTime(lengthSeconds));
}

function newLength() {
	lengthCount++;
	$("#lengthCount").text(lengthCount);
	clearInterval(lengthTimer);
	lengthSeconds = 0;
	$("#lengthTime").text(getFormattedTime(lengthSeconds));
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
	reset();
	$("#pausedTraining").hide();
	$("#initialScreen").show();
}

$(document).ready(init);