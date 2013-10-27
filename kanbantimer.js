(function() {
  var timerBar; 
  var timerLabel;
  var playButton;
  var stopButton;
  var timeButtons;
  var timer;


  function init() {
    timerBar   = $('#timerBar');
    timerLabel = $('#timerLabel');

    timeButtons = $('button.time');
    playButton  = $('button.play');
    stopButton  = $('button.stop');

    // Setup event handlers
    timeButtons.click(handleTimeSelection);
    playButton.click(handleTimerState);
    stopButton.click(handleTimerState);
    gapi.hangout.data.onStateChanged.add( handleStateChange );
  }

  function handleStateChange(event) {
    var selectedTime = parseInt(gapi.hangout.data.getValue('selectedTime'));
    var currentTime  = parseInt(gapi.hangout.data.getValue('currentTime'));
    var timerState   = gapi.hangout.data.getValue('timerState');

    switch (timerState) {
      case 'playing':
        startTimer();
        break;

      case 'resetting':
        currentTime = '0';
        stopTimer();
        break;

      case 'stopped':
        stopTimer();
        break;
    }
    adjustTimer(currentTime, selectedTime);
  }; 

  function adjustTimer(currentTime, selectedTime) {
    timerBar.attr('max', selectedTime);
    timerBar.attr('value', currentTime);
    timeButtons.removeAttr('disabled').filter("[data-seconds='" + selectedTime + "']").attr('disabled', 'disabled');
  };

  function handleTimeSelection(event) {
    gapi.hangout.data.submitDelta({'timerState'    : 'resetting',
                                   'currentTime'   : '0',
                                   'selectedTime'  : '' + $(this).data('seconds')
                                  });
  };

  function handleTimerState(event) {
    var state = $(this).hasClass('play') ? 'playing' : 'stopped';


    gapi.hangout.data.submitDelta({'timerState'    : state,
                                   'currentTime'   : timerBar.attr('value')
                                  });
  };

  function startTimer() {
    timer = setInterval(tick, 100);

    timeButtons.attr('disabled', 'disabled');
    playButton.attr('disabled', 'disabled');
    stopButton.removeAttr('disabled');
  };

  function stopTimer() {
    window.clearInterval(timer);

    playButton.removeAttr('disabled');
    stopButton.attr('disabled', 'disabled');
    timeButtons.removeAttr('disabled');
  };

  function tick() {
    var currentTime  = parseInt(timerBar.attr('value')) + 1;
    var selectedTime = parseInt(gapi.hangout.data.getValue('selectedTime'));

    timerBar.attr('value', currentTime);

    if (currentTime >= selectedTime) {
      stopTimer();
    }
  };

  jQuery(document).ready(function() {
    init();
  });
}());

