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

  if (localStorage.getItem('lh-table') != undefined)
  {
    config['lh-table'] = localStorage.getItem('lh-table');
  }
  else
  {
    config['lh-table'] = php_config['LH-table']; 
  }
}

$( document ).ready(function() { 
  loadSettings(); 
  $("#alerts_enabled").bootstrapSwitch();
  $("#datetime").bootstrapSwitch();
});

var params = function() {
    function urldecode(str) {
        return decodeURIComponent((str+'').replace(/\+/g, '%20'));
    }

    function transformToAssocArray( prmstr ) {
        var params = {};
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = urldecode(tmparr[1]);
        }
        return params;
    }

    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}();
