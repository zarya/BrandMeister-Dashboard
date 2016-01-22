var table = [];

function updateMasterListCallback(master,host) {
  return function(data) {
    var device = {};
    device['Country'] = CountryImage(getCountry(data['network']))+" "+getCountry(data['network']).toUpperCase();
    device['Number'] = data['network'];
    device['Version'] = data['version'];
    device['Links'] = '<a role="button" class="btn btn-xs btn-primary" target="_blank" href="http://' + host + '/status/status.htm">Status</a>&nbsp;<a role="button" class="btn btn-xs btn-info" target="_blank" href="http://' + host + '/status/list.htm">List</a>';
    table.push(device);
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

function updateMasterList()
{
  table = [];
  for (var number in servers) {
    $.getJSON('http://' + servers[number] + '/status/system.php?callback=?', updateMasterListCallback(number,servers[number]));
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

updateMasterList();

