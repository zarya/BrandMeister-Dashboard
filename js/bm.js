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
var modelCount;
var masterDoneCount;
var masterDoneCountList;

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
  masterDoneCount = 0; 
  masterDoneCountList = 0; 
  country_cnt = {
    'dongle': {},
    'repeater': {},
    'homebrew': {},
    'homebrewDgl': {}
  };
  modelCount = {'vendor':[],'model':[],'modelVer':[]};
  $('#modelChart').highcharts().showLoading();
  $('#country_cnt').highcharts().showLoading();
  for (var number in servers) {
    fetchServer(number);
    fetchModels(number);
  }
}

function fetchServer(number) {
  $.ajaxSetup({
    timeout: config['timeout'] * 1000 
  });
  $.getJSON('http://' + servers[number] + '/status/' + 'status.php?callback=?',
    function(data)
    {
      var status_link_count = 0
      for (key in data)
      {
        status_link_count++;
        var value = data[key];
        if (value['number'].toString().substring(0,4) == "2440")
          var country = "2440";
        else
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
          if (value['name'] == "Homebrew Repeater" || value['name'] == "MMDVM Host") {
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
      if (status_link_count > 0)
        masters_count++;
      $("#count_rptr").html(repeater_count);
      $("#count_dongle").html(dongle_count);
      $("#count_homebrew").html(homebrew_count + ' / ' + homebrewDgl_count);
      $("#count_master").html(masters_count);
      $(".RepeaterCircle").trigger('configure', {'max': station_total,'min':0});
      $(".RepeaterCircle").trigger('change');
      $("#repeater_tx_input").val(slots_tx).trigger('change');
      $("#repeater_rx_input").val(slots_rx).trigger('change');
      $("#external_input").val(external_count).trigger('change');
      masterDoneCount++;
      draw_country_plot(country_cnt);
    }
  ).fail(function(){ 
    newAlertPopup(php_lang['Monitoring']['Error'],php_lang['Monitoring']['Master']+' '+number+' '+php_lang['Monitoring']['not responding']);
    masterDoneCount++;
    draw_country_plot(country_cnt);
  });
}

function findByProperty(objects, prop, value) {
    var index;
    $(objects).each(function(i, e) {
        if (e[prop] && e[prop] == value) {
            index = i;
            return false;
        }
    });
    return index;
}

function fetchModels(number) {
  var chart = $('#modelChart').highcharts();
  $.getJSON('http://' + servers[number] + '/status/' + 'list.php?callback=?',
    function(data)
    {
      for (key in data)
      {
        var value = data[key];
        var model = getRepeaterModel(value['hardware'],value['number']);
        if (value['hardware'] == "" && value['frequency1'] == 0 && value['frequency2'] == 0) model = "DV4mini";

        if (model == "-") continue
        var vendor = model.split(" ")[0];

        //Build vendor/model table
        if (modelCount['model'][vendor] == undefined)
          modelCount['model'][vendor]={'name':vendor,'data':[],'type': 'pie'};
        var modelVendorKey = findByProperty(modelCount['model'][vendor]['data'],0, model)

        if (modelVendorKey > -1)
          modelCount['model'][vendor]['data'][modelVendorKey][1]++;
        else
          modelCount['model'][vendor]['data'].push([model,1]);

        //Build vendor table
        var vendorKey = findByProperty(modelCount['vendor'],'name', vendor)
        if (vendorKey > -1)
          modelCount['vendor'][vendorKey]['y']++;
        else
          modelCount['vendor'].push({'name':vendor,'drilldown':vendor,'y':1});

        //Build vendor/version table
        var version = value['firmware'];
        if (modelCount['modelVer'][vendor] == undefined)
          modelCount['modelVer'][vendor]={'name':vendor,'data':[],'type': 'pie'};
        var modelVendorKey = findByProperty(modelCount['modelVer'][vendor]['data'],0, version)

        if (modelVendorKey > -1)
          modelCount['modelVer'][vendor]['data'][modelVendorKey][1]++;
        else
          modelCount['modelVer'][vendor]['data'].push([version,1]);
      }
      masterDoneCountList++;
      modelChartUpdate();
    }
  ).fail(function(){ masterDoneCountList++; modelChartUpdate(); });
}

function modelChartUpdate()
{
  if (masterDoneCountList < (Object.keys(servers).length - 4)) return;
  var chart = $('#modelChart').highcharts();
  chart.series[0].setData(modelCount['vendor'],true);
  chart.hideLoading();
  var chart = $('#versionChart').highcharts();
  chart.series[0].setData(modelCount['vendor'],true);
  chart.hideLoading();
}

function draw_charts()
{
  $('#modelChart').highcharts({
    chart: {
      type: 'pie',
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        drilldown: function (e) {
          if (!e.seriesOptions) {
            console.log(e);
            var chart = this;
            console.log(e.point.name);
            series = modelCount['model'][e.point.name]
            chart.addSeriesAsDrilldown(e.point, series);
          }
        }
      }
    },
    title: {
      text: 'Repeater models',
      align: 'center'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Repeater models',
      drilldown: true,
      data: [] 
    }],
    drilldown: {
      series: []
    }

  });
  $('#versionChart').highcharts({
    chart: {
      type: 'pie',
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        drilldown: function (e) {
          if (!e.seriesOptions) {
            console.log(e);
            var chart = this;
            console.log(e.point.name);
            series = modelCount['modelVer'][e.point.name]
            chart.addSeriesAsDrilldown(e.point, series);
          }
        }
      }
    },
    title: {
      text: 'Repeater versions',
      align: 'center'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Repeater versions',
      drilldown: true,
      data: [] 
    }],
    drilldown: {
      series: []
    }

  });
  $('#country_cnt').highcharts({
    chart: {
      type: 'column'
    },
    title: {
      text: php_lang['Dashboard']['Online per country'] 
    },
    xAxis: {
      categories: [] 
    },
    yAxis: {
      min: 0,
      title: {
        text: php_lang['Dashboard']['GraphYaxis']
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
      {'name':php_lang['Dashboard']['Homebrew Hotspots'],'data': []},
      {'name':php_lang['Dashboard']['DV4minis'],'data': []},
      {'name':php_lang['Dashboard']['Homebrew Repeaters'],'data': []},
      {'name':php_lang['Dashboard']['Industrial Repeaters'],'data': []}
    ]
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
  if (masterDoneCount < (Object.keys(servers).length - 4)) return;

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
  var chart = $('#country_cnt').highcharts();
  chart.xAxis[0].setCategories(categories, true, true);
  chart.series[0].setData(homebrewDgl);
  chart.series[1].setData(dongles);
  chart.series[2].setData(homebrew);
  chart.series[3].setData(repeaters);
  chart.hideLoading();
}

draw_charts();
updateRepeaterCount();
setInterval(updateRepeaterCount, 60000);

$(document).ready(function(){
  if (retina())
  {
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
  }
  else 
  {
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

var urlreg = /(.+:\/\/?[^\/]+)(\/.*)*/;
var pathname = urlreg.exec( php_config['LHServers'][0]['url'] );
var options = {};

if (pathname[2]) options['path'] = pathname[2];
if (pathname[0].charAt(4) == "s") options['secure'] = true;

var socket = io.connect(pathname[1],options);

socket.on('connect', function () {
  var table = [];
  var last = [];
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
      lastraw['SourceCall'] = getGroupName(lastraw['SourceID'],lastraw['Master']);

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
      ref = getGroupName(lastraw['ReflectorID'],lastraw['Master']) + ' (' + lastraw['ReflectorID'] + ')';
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
    var entry = {}
    entry[php_lang['LH']['Time']] = datetime;
    entry[php_lang['LH']['Link name']] = lastraw['LinkName'];
    entry[php_lang['LH']['My call']] = Source;
    entry[php_lang['LH']['Source']] = CountryImage(rcountry) + ' ' + lastraw['LinkCall'] + ' (' + lastraw['ContextID'] + ')';
    entry[php_lang['LH']['Destination']] =  group + ' ' + CountryImage(dcountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID'],lastraw['Master']) +' (' + getGroupFormatting(lastraw['DestinationID'],lastraw['Master']) + ')';
    entry[php_lang['LH']['Reflector']] = ref;
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
