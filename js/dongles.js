var table = [];

function updateDongleListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      if (value['link'] == 4) {
        var device = {};
        device[php_lang['Hotspots']['Number']] = CountryImage(getCountry(value['number']))+" "+value['number'];
        device[php_lang['Hotspots']['Name']] = '<a href="'+baseurl+'index.php?page=lh&country=null&repeater='+value['number']+'">' + value['name'] + '</a>';
        device[php_lang['Hotspots']['Hardware']] = getRepeaterModel(value['hardware'],value['number']);
        device[php_lang['Hotspots']['Firmware']] = value['firmware'];
        device[php_lang['Hotspots']['Tx']] = getFrequency(value['frequency1']);
        device[php_lang['Hotspots']['Rx']] = getFrequency(value['frequency2']);
        device[php_lang['Hotspots']['CC']] = value['color'];
        device[php_lang['Hotspots']['Status']] = getLinkDescription(value['link']);
        device[php_lang['Hotspots']['Master']] = master; 
        table.push(device);
      }
    }
    document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-bordered bootstrap-datatable datatable", 'Bla');
    $('#jsonTable').dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
        "sLengthMenu": "_MENU_ "+php_lang['Table']['records per page']
        },
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, php_lang['Table']['All']] ]
    } );
  }
}

function updateDongleList()
{
  table = [];
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/list.php?callback=?', updateDongleListCallback(number)).fail(newAlertPopup('Error!','Master '+number+' not responding'));
  }
}

updateDongleList();
