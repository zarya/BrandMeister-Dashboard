var table = [];

function updateAlertListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      //{"name":"Voltage Alarm","repeater":206901,"network":2062,"date":"2016-02-14 21:31:40","time":1455485500,"stamp":1455485500000}
      var _alert = {};
      _alert['Time'] = value['date'];
      _alert['Repeater'] = CountryImage(getCountry(value['repeater'])) + " " + value['repeater'];
      _alert['Alarm'] = value['name'];
      _alert['Master'] = CountryImage(getCountry(value['network'])) + " " + value['network'];
    
      table.unshift(_alert);
    }
    document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-bordered bootstrap-datatable datatable", 'Bla');
    $('#jsonTable').dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
        },
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
        "order": [[ 0, "desc" ]]
    } );
  }
}


$.getJSON('http://tracker.dstar.su/api/alerts.php?callback=?', updateAlertListCallback());

