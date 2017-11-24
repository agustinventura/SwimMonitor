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
        } else {
            history.back();
        }
    }
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
	lengthCount = 1;
	var style = $("#selectedLength").html();
}

$(document).ready(init);