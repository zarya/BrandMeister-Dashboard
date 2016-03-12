var device = [];
var reflectors = [];
var t;
var dataTable; 

function updateRepeaterNames()
{
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'list.php?callback=?',{format:'json'}, updateRepeaterNamesCallback(number)); 
  }
}

function updateRepeaterNamesCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      device[value['number']] = {'name': '','ref': ''};
      device[value['number']]['name'] = CountryImage(getCountry(value['number']))+" " + value['name'];
      device[value['number']]['country'] = getCountry(value['number']);
    }
    updateReflectors(master); 
  }
}

function updateReflectors(number) {
  var location = 'http://' + servers[number] + '/status/';
  $.getJSON(location + 'status.php?callback=?',
    function(data)
    {
      for (index in data) {
        var value = data[index];
        entry  = [];
        if (device[value['number']]) {
          device[value['number']]['ref'] = value['values'][19];
          if (device[value['number']]['ref'] > 0 && (params['search']==undefined || params['search']==device[value['number']]['country']))
          {
            entry[0] = device[value['number']]['name'];
            entry[1] = device[value['number']]['ref'];
            dataTable.row.add(entry);
          }
        }
      }
      dataTable.draw();
    }
  );
}

function initTable () {
  return $('#jsonTable').DataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
    "sPaginationType": "bootstrap",
    "language": php_lang['Table']['DataTables'],
    "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, php_lang['Table']['All']] ]
  } );
}

$(document).ready(function() {
  dataTable = initTable();
  updateRepeaterNames();
});


