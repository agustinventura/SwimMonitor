function init() {
	$("#styleSelector").hide();
	$("#oldTrainings").hide();
    setInitialListeners();
}

function setInitialListeners() {
	$("#showStyles").click(showStyles);
    $("#showOldTrainings").click(showOldTrainings);
    
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
	$("#styleSelector").show();
}

function showOldTrainings() {
	$("#initialScreen").hide();
	$("#showOldTrainings").show();
}

$(document).ready(init);