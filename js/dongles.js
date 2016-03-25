var dataTable;

function updateDongleListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      if (value['link'] == 4) {
        var device = [];
        device[0] = CountryImage(getCountry(value['number']))+" "+value['number'];
        device[1] = '<a href="'+baseurl+'index.php?page=lh&country=null&repeater='+value['number']+'">' + value['name'] + '</a>';
        device[2] = getRepeaterModel(value['hardware'],value['number']);
        device[3] = value['firmware'];
        device[4] = getFrequency(value['frequency1']);
        device[5] = getFrequency(value['frequency2']);
        device[6] = value['color'];
        device[7] = getLinkDescription(value['link']);
        device[8] = master; 
        dataTable.row.add(device); 
      }
    }
    dataTable.draw();
  }
}

function initTable () {
  return $('#jsonTable').DataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
    "sPaginationType": "bootstrap",
    "language": php_lang['Table']['DataTables'],
    "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, php_lang['Table']['All']] ]
  } );
}

function updateDongleList()
{
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/list.php?callback=?', updateDongleListCallback(number));
  }
}

$(document).ready(function() {
  dataTable = initTable();
  updateDongleList();
});

