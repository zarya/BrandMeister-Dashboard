var dataTable;

function updateRepeaterListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      if (value['link'] < 4) {
        device = [];
        device[0] = CountryImage(getCountry(value['number']))+" "+value['number'];
        device[1] = '<a href="'+baseurl+'index.php?page=lh&country=null&repeater='+value['number']+'&unique=1">' + value['name'] + '</a> <a href="'+baseurl+'index.php?page=callstats&repeater='+value['number']+'"><i class="icon-bar-chart"></i></a>';
        device[2] = getRepeaterModel(value['hardware'],value['number']);
        device[3] = value['firmware'];
        device[4] = getFrequency(value['frequency1']);
        device[5] = getFrequency(value['frequency2']);
        device[6] = ""+value['color'];
        device[7] = getLinkDescription(value['link']);
        device[8] = master;
        if (params['search']) {
          if (params['search'] == getCountry(value['number']))
          {
            dataTable.row.add(device).draw();
          }
        } 
        else
          dataTable.row.add(device).draw();
      }
    }
  }
}

function updateRepeaterList()
{
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/list.php?callback=?', updateRepeaterListCallback(number)).fail(newAlertPopup('Error!','Master '+number+' not responding'));
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

$(document).ready(function() {
  dataTable = initTable();
  updateRepeaterList();
});
