StyleEnum = {
	BRAZA: "Pecho",
	CROL: "Crol",
	ESPALDA: "Espalda",
	MARIPOSA: "Mariposa"
}

function init() {
	hideNonVisibleDivs();
    setInitialListeners();
}

function hideNonVisibleDivs() {
	$("#styleSelector").hide();
	$("#oldTrainings").hide();
}

function setInitialListeners() {
	$("#showStyles").click(showStyles);
    $("#showOldTrainings").click(showOldTrainings);
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
	var stylesList = $("chooseStyle");
	stylesList.clear();
	
}

function showOldTrainings() {
	$("#initialScreen").hide();
	$("#showOldTrainings").show();
}

function styleChosen() {
	var index = $(this).index();
    var text = $(this).text();
    alert('Index is: ' + index + ' and text is ' + text);
}

$(document).ready(init);