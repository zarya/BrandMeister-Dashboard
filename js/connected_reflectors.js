var device = [];
var reflectors = [];
var t;

function updateRepeaterNames()
{
  var country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {}
  };
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'list.php?callback=?',{format:'json'})
      .done(function(data)
      {
        for (key in data)
        {
          var value = data[key];
          device[value['number']] = {'name': '','ref': ''};
          device[value['number']]['name'] = CountryImage(getCountry(value['number']))+" " + value['name'];
          device[value['number']]['country'] = getCountry(value['number']);
        }
        t = setTimeout(updateReflectors, 100)
      }
   ); 
  }
}

function updateReflectors() {
  clearTimeout(t);
  console.log("updateReflectors");
  var table = [];
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'status.php?callback=?',
      function(data)
      {
        for (index in data) {
          var value = data[index];
          if (device[value['number']]) {
            device[value['number']]['ref'] = value['values'][19];
            if (device[value['number']]['ref'] > 0 && (params['search']==undefined || params['search']==device[value['number']]['country']))
              entry  = {};
              entry[php_lang['Connected reflectors']['Name']] = device[value['number']]['name'];
              entry[php_lang['Connected reflectors']['Reflector']] = device[value['number']]['ref'];
              table.push(entry);
          }
        }
        document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-bordered bootstrap-datatable datatable", 'Bla');
        $('#jsonTable').dataTable({
          "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
          "sPaginationType": "bootstrap",
          "oLanguage": php_lang['Table']['DataTables'],
          "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, php_lang['Table']['All']] ]
        });
      }
    );
  }
}

updateRepeaterNames();
setInterval(updateRepeaterNames, 100000);

