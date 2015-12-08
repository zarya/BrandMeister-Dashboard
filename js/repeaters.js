
function updateRepeaterList()
{
  var country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {}
  };
  var table = [];
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'list.php?callback=?',
      function(data)
      {
        for (key in data)
        {
          var value = data[key];
          if (value['link'] < 4) {
            var device = {};
            device['Number'] = CountryImage(getCountry(value['number']))+" "+value['number'];
            device['Name'] = '<a href="/dashboard/index.php?page=lh&country=null&repeater='+value['number']+'&unique=1">' + value['name'] + '</a>';
            device['Hardware'] = getRepeaterModel(value['hardware']);
            device['Firmware'] = value['firmware'];
            device['TX'] = getFrequency(value['frequency1']);
            device['RX'] = getFrequency(value['frequency2']);
            device['CC'] = value['color'];
            device['Status'] = getLinkDescription(value['link']);
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

var params = function() {
    function urldecode(str) {
        return decodeURIComponent((str+'').replace(/\+/g, '%20'));
    }

    function transformToAssocArray( prmstr ) {
        var params = {};
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = urldecode(tmparr[1]);
        }
        return params;
    }

    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}();

updateRepeaterList();

