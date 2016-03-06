var table = [];

function updateRepeaterListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      if (value['link'] < 4) {
        var device = {};
        device[php_lang['Repeaters']['Number']] = CountryImage(getCountry(value['number']))+" "+value['number'];
        device[php_lang['Repeaters']['Name']] = '<a href="'+baseurl+'index.php?page=lh&country=null&repeater='+value['number']+'&unique=1">' + value['name'] + '</a> <a href="'+baseurl+'index.php?page=callstats&repeater='+value['number']+'"><i class="icon-bar-chart"></i></a>';
        device[php_lang['Repeaters']['Hardware']] = getRepeaterModel(value['hardware'],value['number']);
        device[php_lang['Repeaters']['Firmware']] = value['firmware'];
        device[php_lang['Repeaters']['TX']] = getFrequency(value['frequency1']);
        device[php_lang['Repeaters']['RX']] = getFrequency(value['frequency2']);
        device[php_lang['Repeaters']['CC']] = value['color'];
        device[php_lang['Repeaters']['Status']] = getLinkDescription(value['link']);
        device[php_lang['Repeaters']['Master']] = master;
        if (params['search']) {
          if (params['search'] == getCountry(value['number']))
            table.push(device);
        } else
        table.push(device);
      }
    }
    document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-bordered bootstrap-datatable datatable", 'Bla');
    $('#jsonTable').dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
        "sPaginationType": "bootstrap",
        "language": php_lang['Table']['DataTables'],
        "oLanguage": {
          "sLengthMenu": "_MENU_ "+php_lang['Table']['records per page']
        },
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, php_lang['Table']['All']] ]
    } );
  }
}

function updateRepeaterList()
{
  table = [];
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/list.php?callback=?', updateRepeaterListCallback(number)).fail(newAlertPopup('Error!','Master '+number+' not responding'));
  }
}

updateRepeaterList();

