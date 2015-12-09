
function updateRepeaterList()
{
  var table = [];
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'system.php?callback=?',
      function(data)
      {
        var device = {};
        device['Number'] = CountryImage(getCountry(number))+" "+getCountry(number).toUpperCase();
        device['Version'] = data['version'];
        table.push(device);
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

