var country_cnt = {
  'dongle': {},
  'repeater': {},
  'homebrew': {}
};
var table = [];

function updateDongleListCallback(master) {
  return function(data) {
    for (key in data)
    {
      var value = data[key];
      if (value['link'] == 4) {
        var device = {};
        device['Number'] = CountryImage(getCountry(value['number']))+" "+value['number'];
        device['Name'] = '<a href="'+baseurl+'index.php?page=lh&country=null&repeater='+value['number']+'">' + value['name'] + '</a>';
        device['Hardware'] = getRepeaterModel(value['hardware'],value['number']);
        device['Firmware'] = value['firmware'];
        device['Tx'] = getFrequency(value['frequency1']);
        device['Rx'] = getFrequency(value['frequency2']);
        device['CC'] = value['color'];
        device['Status'] = getLinkDescription(value['link']);
        device['Master'] = master; 
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

function updateDongleList()
{
  country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {}
  };
  table = [];
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/list.php?callback=?', updateDongleListCallback(number)).fail(newAlertPopup('Error!','Master '+number+' not responding'));
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

updateDongleList();
