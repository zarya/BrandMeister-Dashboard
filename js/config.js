var config = {};

function saveSettings(){
  if ($('#datetime').is(':checked') == true)
    localStorage.setItem('datetime', true);
  else
    localStorage.removeItem('datetime');
  window.location.reload();
}

function loadSettings() {
    console.log(localStorage.getItem('datetime'));
    if (localStorage.getItem('datetime') != undefined)
        config['datetime'] = localStorage.getItem('datetime');
    else
        config['datetime'] = false;
    $('#datetime').prop('checked', config['datetime']);
    console.log(config['datetime']);
    console.log("Loaded config"); 
}

$( document ).ready(function() { 
  loadSettings(); 
});
