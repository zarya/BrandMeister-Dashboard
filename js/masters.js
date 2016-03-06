var table = [];

function updateMasterListCallback(master,host) {
  return function(data) {
    var entity = {};
    entity[php_lang['Masters']['Country']] = CountryImage(getCountry(data['network']))+" "+getCountry(data['network']).toUpperCase();
    entity[php_lang['Masters']['Number']] = data['network'];
    entity[php_lang['Masters']['Version']] = data['version'];
    entity[php_lang['Masters']['Links']] = '<a role="button" class="btn btn-xs btn-primary" target="_blank" href="http://' + host + '/status/status.htm">'+php_lang['Masters']['Status']+'</a>&nbsp;<a role="button" class="btn btn-xs btn-info" target="_blank" href="http://' + host + '/status/list.htm">'+php_lang['Masters']['List']+'</a>';
    if (data['set'] != 0)
      table.push(entity);
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

function updateMasterList()
{
  table = [];
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/system.php?callback=?', updateMasterListCallback(number,servers[number]));
  }
}

updateMasterList();

