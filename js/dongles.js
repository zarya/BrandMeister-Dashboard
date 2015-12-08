

function updateRepeaterList()
{
  var country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {}
  };
  var table = [];
  var master_number = "";
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    master_number = String(number).substring(0,3);
    $.getJSON(location + 'list.php?callback=?',
      function(data)
      {
        for (key in data)
        {
          var value = data[key];
          if (value['link'] == 4) {
            var device = {};
            device['Number'] = CountryImage(getCountry(value['number']))+" "+value['number'];
            device['Name'] = '<a href="/dashboard/index.php?page=lh&country=null&repeater='+value['number']+'">' + value['name'] + '</a>';
            device['Hardware'] = getRepeaterModel(value['hardware']);
            device['Firmware'] = value['firmware'];
            device['Tx'] = getFrequency(value['frequency1']);
            device['Rx'] = getFrequency(value['frequency2']);
            device['CC'] = value['color'];
            device['Status'] = getLinkDescription(value['link']);
            table.push(device);
          }
        }
        document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-bordered bootstrap-datatable datatable", 'Bla');
        $('#jsonTable').dataTable({
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
            }
        } );
      }
   ); 
  }
}
function getCountry(number)
{
  var value = String(number).substring(0,3);
  if (countries.hasOwnProperty(value))
    return countries[value];
}
function CountryImage(country){
  if (country != null)
    return '<img src="images/flags/png/' + country + '.png" \>';
  else
    return '';
}

updateRepeaterList();
