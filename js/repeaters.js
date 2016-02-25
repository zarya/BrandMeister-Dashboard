var country_cnt = {
  'dongle': {},
  'repeater': {},
  'homebrew': {}
};
var table = [];

function updateRepeaterListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      if (value['link'] < 4) {
        var device = {};
        device['Number'] = CountryImage(getCountry(value['number']))+" "+value['number'];
        device['Name'] = '<a href="'+baseurl+'index.php?page=lh&country=null&repeater='+value['number']+'&unique=1">' + value['name'] + '</a><a href="'+baseurl+'index.php?page=callstats&repeater='+value['number']+'"><i class="icon-bar-chart"></i></a>';
        device['Hardware'] = getRepeaterModel(value['hardware'],value['number']);
        device['Firmware'] = value['firmware'];
        device['TX'] = getFrequency(value['frequency1']);
        device['RX'] = getFrequency(value['frequency2']);
        device['CC'] = value['color'];
        device['Status'] = getLinkDescription(value['link']);
        device['Master'] = master;
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
        "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
        },
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ]
    } );
  }
}

function updateRepeaterList()
{
  country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {}
  };
  table = [];
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/list.php?callback=?', updateRepeaterListCallback(number)).fail(newAlertPopup('Error!','Master '+number+' not responding'));
  }
}

updateRepeaterList();

