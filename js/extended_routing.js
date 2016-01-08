var dongles = $('#dongle-list');
loadDongles();

$('#dongle-list').live('change', function(e) {
  data = e.target.options[e.target.selectedIndex].value.split('-');
  dongle = data[1];
  master = data[0];
  $.getJSON('http://' + servers[master] + '/status/link.php?callback=?',function(data)
  {
    $('#group').val(data['group']);
  });

});

function loadDonglesCallback(master) {
  return function(data) {
    if (Object.keys(data).length > 0)
    {   
      dongles.append( new Option(master+' - ' + data['number'],master+'-'+data['number']) )
    }
  };
}

function loadDongles() {
  for (var number in servers) {
    var master = number;
    $.getJSON('http://' + servers[number] + '/status/link.php?callback=?', loadDonglesCallback(number));
  }
}

function linkCallback() {
  return function(data) {
    newAlert('success', 'Saved!');
  };
}

function link()
{
  var data = $('#dongle-list').val().split('-')
  if (data.length != 2)
  {
    newAlert('error', 'Error: Missing dongle');
    return;
  }
  if ($('#group').val() >= 4000 && $('#group').val() <= 5000)
  {
    newAlert('error', 'Error: Cant connect to a reflector please use a talkgroup');
    return;
  }
  dongle = data[1];
  master = data[0];
  var parameters =
  {
    group: $('#group').val()
  };
  console.log(parameters['group']+' '+master);
  $.getJSON('http://' + servers[master] + '/status/link.php?callback=?', parameters, linkCallback()).fail(function(d) {
    newAlert('error', 'Error!!')
  });
};



