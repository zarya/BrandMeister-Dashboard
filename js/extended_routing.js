var dongles = $('#dongle-list');

function loadDongles() {
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'link.php?callback=?',
      function(data) {
        if (Object.keys(data).length > 0)
        {
          dongles.append(
            $('<option value="'+number+'-'+data['number']+'">'+number+' - ' + data['number'] + '</option>').val(val).html(text)
          );
        }
      });
  }
}

function handleResponseData(data)
{
  if (Object.keys(data).length > 0)
  {
    $('#number').val(data['number']);
    $('#group').val(data['group']);
  }
};

function link()
{
  var parameters =
  {
    group: $('#group').val()
  };
  $.getJSON(service, parameters, handleResponseData);
};

