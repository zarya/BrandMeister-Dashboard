var station_total = 0;
var _series = ['','','',''];
var repeater_count = 0;
var dongle_count = 0;
var homebrew_count = 0;
var homebrewDgl_count = 0;
var slots_tx = 0;
var slots_rx = 0;
var external_count = 0;
var masters_count = 0;
var country_cnt = {
'dongle': {},
'repeater': {},
'homebrew': {},
'homebrewDgl': {}
};

function updateRepeaterCount()
{
  station_total = 0;
  repeater_count = 0;
  dongle_count = 0;
  homebrew_count = 0;
  homebrewDgl_count = 0;
  slots_tx = 0;
  slots_rx = 0;
  external_count = 0;
  masters_count = 0;
  country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {},
    'homebrewDgl': {}
  };
  for (var number in servers) {
    fetchServer(number);
  }
}

function fetchServer(number) {
  $.getJSON('http://' + servers[number] + '/status/' + 'status.php?callback=?',
    function(data)
    {
      masters_count++;
      for (key in data)
      {
        var value = data[key];
        var country = value['number'].toString().substring(0,3);
        if (value['type'] == 1) {
          if (value['name'] == "Hytera Multi-Site Connect" || value['name'] == "Motorola IP Site Connect") {
            repeater_count++
            country_cnt = country_count(country_cnt,'repeater',country);
          }
          if (value['name'] == "DV4mini") {
            dongle_count++;
            country_cnt = country_count(country_cnt,'dongle',country);
          }
          if (value['name'] == "Homebrew Repeater") {
            if (value['values'][1] == 0) {
              homebrewDgl_count++;
              country_cnt = country_count(country_cnt,'homebrewDgl',country);
            } 
            else 
            {
              homebrew_count++;
              country_cnt = country_count(country_cnt,'homebrew',country);
            }
          }
          if (value['name'] == "MMDVM Host") {
            homebrew_count++;
            country_cnt = country_count(country_cnt,'homebrew',country);
          }
          // Link has an outgoing lock
          if ((value['state'] & 0x2a) != 0)
            slots_tx++; 
          // Link has an incoming lock
          if ((value['state'] & 0x15) != 0)
            slots_rx++;
          station_total++; 
        }
        if (value['name'] == 'CBridge CC-CC Link')
        {
          external_count = external_count + value['values'][1];
        }

        if (value['name'] == 'D-Extra Link') {
          if ((value['state'] & 0x03) != 0)
            external_count++;
        }

        if (value['name'] == 'DCS Link') {
          if ((value['state'] & 0x03) != 0)
            external_count++;
        }
        if (value['name'] == 'AutoPatch') {
          if ((value['state'] & 0x03) != 0)
            external_count++;
        }
      }
      $("#count_rptr").html(repeater_count);
      $("#count_dongle").html(dongle_count);
      $("#count_homebrew").html(homebrew_count + ' / ' + homebrewDgl_count);
      $("#count_master").html(masters_count);
      $(".RepeaterCircle").trigger('configure', {'max': station_total,'min':0});
      $(".RepeaterCircle").trigger('change');
      $("#repeater_tx_input").val(slots_tx).trigger('change');
      $("#repeater_rx_input").val(slots_rx).trigger('change');
      $("#external_input").val(external_count).trigger('change');
      draw_country_plot(country_cnt);
    }
  ).fail(function(){
    $.gritter.add({
      title: 'Error!',
      text: 'Master '+number+' not responding',
      sticky: false,
      time: ''
    });
  }); 
}

function country_count(data,type,country) {
  if (data[type][country])
    data[type][country]++;
  else
    data[type][country] = 1;
  return data;
}

function draw_country_plot(data) {
  var _plot = [];
  var _categories = {};
  for (type in data) {
    var plot_data = {};
    for (i in data[type]) {
      if (countries[i]) {
        _categories[countries[i]] = countries[i].toUpperCase();
        if (plot_data[countries[i]])
          plot_data[countries[i]] = plot_data[countries[i]] + data[type][i];
        else
          plot_data[countries[i]] = data[type][i];
      }
    }

    if (type == "repeater") {
      _series[3] = plot_data;
    }
    if (type == "dongle") {
      _series[1] = plot_data;
    }
    if (type == "homebrew") {
      _series[2] = plot_data;
    }
    if (type == "homebrewDgl") {
      _series[0] = plot_data;
    }
  }
  
  var categories = [];
  var repeaters = [];
  var dongles = [];
  var homebrew = [];
  var homebrewDgl = [];
  for (i in _categories) {
    categories.push(_categories[i]);
    repeaters.push('');
    dongles.push('');
    homebrew.push('');
    homebrewDgl.push('');
    if (_series[3][i] != undefined) repeaters[categories.length-1] = _series[3][i];
    if (_series[1][i] != undefined) dongles[categories.length-1] = _series[1][i];
    if (_series[2][i] != undefined) homebrew[categories.length-1] = _series[2][i];
    if (_series[0][i] != undefined) homebrewDgl[categories.length-1] = _series[0][i];
  }
  $('#country_cnt').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Online per country'
        },
        xAxis: {
            categories: categories 
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Homebrew/Dongles/Repeaters'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            },
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [
          {'name':'Homebrew Dongles','data': homebrewDgl},
          {'name':'DV4mini Dongles','data': dongles},
          {'name':'Homebrew Repeaters','data': homebrew},
          {'name':'Professional Repeaters','data': repeaters}]
    });
}

updateRepeaterCount();
setInterval(updateRepeaterCount, 60000);
$(document).ready(function(){

if (retina()) {

        $(".RepeaterCircle").knob({
            'min':0,
            'max':station_total,
            'readOnly': true,
            'width': 240,
            'height': 240,
            'bgColor': 'rgba(255,255,255,0.5)',
            'fgColor': 'rgba(255,255,255,0.9)',
            'dynamicDraw': true,
            'thickness': 0.2,
            'tickColorizeValues': true
        });

        $(".circleStat").css('zoom',0.5);
        $(".whiteCircle").css('zoom',0.999);


    } else {

        $(".RepeaterCircle").knob({
            'min':0,
            'max':station_total,
            'readOnly': true,
            'width': 120,
            'height': 120,
            'bgColor': 'rgba(255,255,255,0.5)',
            'fgColor': 'rgba(255,255,255,0.9)',
            'dynamicDraw': true,
            'thickness': 0.2,
            'tickColorizeValues': true
        });

    }
});

var max_queue = 5;
var table = [];
var last = [];
var socket = io.connect('http://home.gigafreak.net:5001');

socket.on('connect', function () {
  var table = [];
  var last = [];
  if (params['country']) params['filter'] = params['country'];
  socket.emit('subscribe',{topic:'filter/'+params['filter']+'/'+params['repeater']});
  socket.on('mqtt', function (msg) {
    var lastraw = JSON.parse(msg.payload);
    if (params['filter']) { 
      if (lastraw['Master'].toString().substring(0,3) != params['filter'] )
        return;
    }
    if (params['repeater']) { 
      if (lastraw['ContextID'].toString() != params['repeater'] )
        return;
    }
    

    options = "";
    if (lastraw['LinkName'] == "D-Extra Link" || lastraw['LinkName'] == "DCS Link") {
        options = "<img src=images/avc/icon_D-STAR.png \>";
    }else{
        options = "<img src=images/avc/icon_DMR_w.png \>";
    }
    group = "";
    if (lastraw['CallTypes'].indexOf("Group") > -1) {
      group = '<img src="images/batch/users.png" \>';
    }else if(lastraw['CallTypes'].indexOf("Voice") > -1) {
      group = '<img src="images/batch/user.png" \>';
    }

    if (lastraw['SourceCall'] == '')
      lastraw['SourceCall'] = getGroupName(lastraw['SourceID']);

    var scountry = getCountry(lastraw['SourceID']);
    var rcountry = getCountry(lastraw['ContextID']);
    var dcountry = getCountry(lastraw['DestinationID']);
    var ref = "";
    
    if (lastraw['SourceName'] == undefined || lastraw['SourceName'] == null || lastraw['SourceName'] == "") {
      var Source = CountryImage(scountry) +' ' + lastraw['SourceCall'] + ' (' + lastraw['SourceID'] + ')';
    } else {
      var Source = CountryImage(scountry) +' '+lastraw['SourceCall'] + ' [' + lastraw['SourceName'] + '] (' + lastraw['SourceID'] + ')' 
    }

    if (lastraw['ReflectorID'] != undefined)
      ref = getGroupName(lastraw['ReflectorID']) + ' (' + lastraw['ReflectorID'] + ')';
    if (config['datetime']) {
      var timestamp = lastraw['Start'];
      var date = new Date(timestamp * 1000);
      var datetime = date.format('yyyy-mm-dd HH:MM:ss');
    }
    else
      var datetime = timeSince(lastraw['Start'])

    var LossCount = "";
    if (lastraw['TotalCount']!=0 && lastraw['TotalCount'] != "undefined") {
      var _percent = Math.round(lastraw['LossCount'] / lastraw['TotalCount'] * 10000)/100;
      LossCount = _percent + "% (" + lastraw['LossCount'] + "/" + lastraw['TotalCount'] + ")";
    }
    var entry = {
      'Time': datetime, 
      'Link name': lastraw['LinkName'],
      'My call': Source,
      'Source':CountryImage(rcountry) + ' ' + lastraw['LinkCall'] + ' (' + lastraw['ContextID'] + ')',
      'Destination': group + ' ' + CountryImage(dcountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID']) +' (' + lastraw['DestinationID'] + ')',
      'Reflector': ref
    };
    var index = functiontofindIndexByKeyValue(last,'SessionID', lastraw['SessionID']);
    if (index != null) {
      table[index] = entry;
      last[index] = lastraw;
    } else {
      if (msg.topic == 'LH-Startup') {
        last.push(JSON.parse(msg.payload));
        table.push(entry);
      } else {
        last.unshift(JSON.parse(msg.payload));
        table.unshift(entry);
      }
    }
    table = table.slice(0,parseInt(max_queue));
    last = last.slice(0,parseInt(max_queue));
    document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-bordered bootstrap-datatable datatable", 'Bla');
  });
});

function getCellDuration(value)
{
  if (isNaN(value))
    return '';
  var seconds = Number(value);
  if (seconds >= 60)
  {
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    var delimiter = (seconds < 10) ? ':0' : ':';
    return minutes + delimiter + seconds.toFixed(0);
  }
  return seconds.toFixed(0);
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
function sMeter(rssi) {
    if (rssi > -63) return '<img src="images/indicator/4.png" \> S9+10dB';
    if (rssi > -73) return '<img src="images/indicator/4.png" \> S9';
    if (rssi > -79) return '<img src="images/indicator/3.png" \> S8';
    if (rssi > -85) return '<img src="images/indicator/3.png" \> S7';
    if (rssi > -91) return '<img src="images/indicator/2.png" \> S6';
    if (rssi > -97) return '<img src="images/indicator/2.png" \> S5';
    if (rssi > -103) return '<img src="images/indicator/1.png" \> S4';
    if (rssi > -109) return '<img src="images/indicator/1.png" \> S3';
    if (rssi > -115) return '<img src="images/indicator/0.png" \> S2';
    if (rssi > -121) return '<img src="images/indicator/0.png" \> S1';
    return '<img src="images/indicator/0.png" \> S0';
}
function TSimage(ts) {
  if (ts > 0)
    return '<img src="images/avc/icon_TS' + ts + '.png" \>';
  else
    return '<img src="images/avc/icon_TS.png" \>';
}

function timeSince(date) {
    date = date * 1000
    var seconds = Math.floor((new Date() - date)/1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " Years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " Months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " Days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " Hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " Minutes";
    }
    return Math.floor(seconds) + " Seconds";
}

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
  for (var i = 0; i < arraytosearch.length; i++) {
    if (arraytosearch[i][key] == valuetosearch) {
      return i;
    }
  }
  return null;
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
