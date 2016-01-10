var dongles = $('#dongle-list');
loadDongles();
loadGroups();

$('#dongle-list').live('change', function(e) {
  data = e.target.options[e.target.selectedIndex].value.split('-');
  dongle = data[1];
  master = data[0];
  $.getJSON('http://' + servers[master] + '/status/link.php?callback=?',function(data)
  {
    $('#group').val(data['group']);
  });

});

$('#group-list').live('change', function(e) {
  group = e.target.options[e.target.selectedIndex].value;
  $('#group').val(group);
  var data = $('#dongle-list').val().split('-')
  if (data.length == 2) link();
});

function loadDonglesCallback(master) {
  return function(data) {
    if ($.isArray(data))
    {
      var value = new String();
      for (var index = 0; index < data.length; index ++)
      {
        dongles.append( new Option(master+' - ' + data[index]['number'],master+'-'+data[index]['number']) )
      }
    }
    if (!$.isEmptyObject(data))
      dongles.append( new Option(master+' - ' + data['number'],master+'-'+data['number']) )
    };
}

function loadDongles() {
  for (var number in servers) {
    var master = number;
    $.getJSON('http://' + servers[number] + '/status/link.php?callback=?', loadDonglesCallback(number));
  }
}

function loadGroups() {
  var grouplist = $('#group-list'); 
  for (var number in groups) {
    //doe dingen
    if (number <= 5000 && number >= 4000 || number < 100) continue;

    grouplist.append( new Option(groups[number] + ' ('+number+')',number) )
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
