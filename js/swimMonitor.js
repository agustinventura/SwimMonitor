StyleEnum = {
	BRAZA: "Pecho",
	CROL: "Crol",
	ESPALDA: "Espalda",
	MARIPOSA: "Mariposa"
}

var selectedStyle = null;

function init() {
	hideNonVisibleDivs();
    setInitialListeners();
}

function hideNonVisibleDivs() {
	$("#styleSelector").hide();
	$("#previousTrainings").hide();
}

function setInitialListeners() {
	$("#showStyles").click(showStyles);
    $("#showPreviousTrainings").click(showPreviousTrainings);
	$("#chooseStyle li").click(styleChosen);
    
    /*$("#resume").click(resumeWorkout);
    $("#exit").click(exit);
	$(document).on('rotarydetent', function(ev) {
		setsRotaryControl(ev);
	});*/
    $(window).on('tizenhwkey', function(e) {
    	backPressed(e);
    });
}

function backPressed(e) {
    var activeDivId = $('.clock:visible');
    if (e.originalEvent.keyName === 'back') {
        if (activePageId === 'roundsPage') {
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
	$("#styleSelector").show();
}

function createStylesList() {
	var stylesList = $("#chooseStyle");
	stylesList.empty();
	for (var style in StyleEnum) {
		stylesList.append($('<li>').text(StyleEnum[style]));
	}
	stylesList.attr('size', Object.keys(StyleEnum).length);
}

function showPreviousTrainings() {
	$("#initialScreen").hide();
	$("#showPreviousTrainings").show();
}

function styleChosen() {
	var index = $(this).index();
    var text = $(this).text();
    alert('Index is: ' + index + ' and text is ' + text);
}

$(document).ready(init);