var config = {};

function saveSettings(){
  if ($('#datetime').is(':checked') == true)
    localStorage.setItem('datetime', true);
  else
    localStorage.removeItem('datetime');

  if ($('#alerts_enabled').is(':checked') == true)
    localStorage.setItem('alerts', true);
  else
    localStorage.removeItem('alerts');

  var timeout = $("#json_timeout").val();
  if (timeout > 60) timeout = 60;
  localStorage.setItem('timeout', timeout);

  window.location.reload();
}

function loadSettings() {
    console.log(localStorage.getItem('datetime'));
    if (localStorage.getItem('datetime') != undefined)
        config['datetime'] = localStorage.getItem('datetime');
    else
        config['datetime'] = false;
    $('#datetime').prop('checked', config['datetime']);

    if (localStorage.getItem('alerts') != undefined)
        config['alerts'] = localStorage.getItem('alerts');
    else
        config['alerts'] = false;
    $('#alerts_enabled').prop('checked', config['alerts']);

    if (localStorage.getItem('timeout') != undefined)
        config['timeout'] = localStorage.getItem('timeout');
    else
        config['timeout'] = 15;
    $("#json_timeout").val(config['timeout']);
}

$( document ).ready(function() { 
  loadSettings(); 
});
