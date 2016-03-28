var dataTable; 

function updateMasterListCallback(master,host) {
  return function(data) {
    var entity = [];
    entity[0] = CountryImage(getCountry(data['network']))+" "+getCountry(data['network']).toUpperCase();
    entity[1] = data['network'];
    entity[2] = data['version'];
    entity[3] = '<a role="button" class="btn btn-xs btn-primary" target="_blank" href="http://' + host + '/status/status.htm">'+php_lang['Masters']['Status']+'</a>&nbsp;<a role="button" class="btn btn-xs btn-info" target="_blank" href="http://' + host + '/status/list.htm">'+php_lang['Masters']['List']+'</a>';
    if (data['set'] != 0)
      dataTable.row.add(entity).draw();
  }
}

function updateMasterList()
{
  dataTable = $('#jsonTable').DataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
    "sPaginationType": "bootstrap",
    "language": php_lang['Table']['DataTables'],
    "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, php_lang['Table']['All']] ]
  });
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/system.php?callback=?', updateMasterListCallback(number,servers[number])).fail(newAlertPopup('Error!','Master '+number+' not responding'));
  }
}
$(document).ready(function() {
  updateMasterList();
});
