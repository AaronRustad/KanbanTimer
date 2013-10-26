(function() {
  var timerBar; 
  var timerLabel;
  var playButton;
  var stopButton;
  var timeButtons;
  var currentTime;
  var selectedTime;
  var timer;


  function init() {
    timerBar   = $('#timerBar');
    timerLabel = $('#timerLabel');

    timeButtons = $('button.time');
    playButton  = $('button.play');
    stopButton  = $('button.stop');

    timeButtons.click(setupTime);

    playButton.click(play);
    stopButton.click(stop);
  }

  function setupTime() {
    var self = $(this);
    selectedTime = parseInt(self.data('seconds'));

    timerLabel.text(self.text());
    timerBar.attr('max', selectedTime);
    timerBar.attr('value', '0');
    currentTime = 0;
  };

  function play() {
    timeButtons.attr('disabled', 'disabled');
    playButton.attr('disabled', 'disabled');
    stopButton.removeAttr('disabled');
    startTimer();
  };

  function stop() {
    playButton.removeAttr('disabled');
    stopButton.attr('disabled', 'disabled');
    timeButtons.removeAttr('disabled');
    stopTimer();
  };

  function startTimer() {
    timer = setInterval(tick, 100);
  };

  function stopTimer() {
    window.clearInterval(timer);
  };

  function tick() {
    currentTime += 1;
    if (currentTime > selectedTime) {
      stop();
    } else {
      timerBar.attr('value', currentTime);
    }
  };

  jQuery(document).ready(function() {
    init();
  });
}());

