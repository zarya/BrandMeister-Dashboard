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
}

$( document ).ready(function() { 
  loadSettings(); 
});
