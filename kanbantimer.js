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

    timeButtons.click(handleTimeSelection);

    playButton.click(play);
    stopButton.click(stop);
    gapi.hangout.data.onStateChanged.add( handleStateChange );
  }

  function handleStateChange(event) {
    var selectedTime = parseInt(gapi.hangout.data.getValue('selectedTime'));
    var currentTime  = parseInt(gapi.hangout.data.getValue('currentTime'));
    var timerState   = gapi.hangout.data.getValue('timerState');

    adjustTimer(currentTime, selectedTime);

    switch (timerState) {
      case 'playing':
        startTimer();
        break;

      case 'resetting':
        adjustTimer('0', selectedTime);
        stopTimer();
        break;

      case 'stopped':
        stopTimer();
        break;
    }
  }; 

  function adjustTimer(currentTime, selectedTime) {
    timerBar.attr('max', selectedTime);
    timerBar.attr('value', currentTime);
  };

  function handleTimeSelection(event) {
    gapi.hangout.data.submitDelta({'timerState'    : 'resetting',
                                   'currentTime'   : '0',
                                   'selectedTime'  : '' + $(this).data('seconds')
                                  });
  };

  function play() {
    timeButtons.attr('disabled', 'disabled');
    playButton.attr('disabled', 'disabled');
    stopButton.removeAttr('disabled');

    gapi.hangout.data.submitDelta({'timerState'    : 'playing',
                                   'currentTime'   : timerBar.attr('value')
                                  });
  };

  function stop() {
    gapi.hangout.data.submitDelta({'timerState'   : 'stopped',
                                   'currentTime'   : timerBar.attr('value')
                                  });

    playButton.removeAttr('disabled');
    stopButton.attr('disabled', 'disabled');
    timeButtons.removeAttr('disabled');
  };

  function startTimer() {
    timer = setInterval(tick, 100);
  };

  function stopTimer() {
    window.clearInterval(timer);
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

