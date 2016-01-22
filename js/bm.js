var station_total = 0;
var _series = ['','','',''];

function updateRepeaterCount()
{
  station_total = 0;
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
  for (var number in servers) {
    var location = 'http://' + servers[number] + '/status/';
    $.getJSON(location + 'status.php?callback=?',
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
   ); 
  }
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
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
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
          {'name':'Homebrew Dongle','data': homebrewDgl},
          {'name':'Dongles','data': dongles},
          {'name':'Homebrew','data': homebrew},
          {'name':'Repeaters','data': repeaters}]
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
