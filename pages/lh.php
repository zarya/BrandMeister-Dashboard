    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php">Home</a>
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#">LastHeard</a></li>
            </ul>

<Select id="source_url" name="source_url" onchange="javascript:SourceChange()">
<?php
while (list($key, $value) = each($config['LHServers'])) {
?>
<option value="<?php echo $value['url']; ?>"><?php echo $value['Name']; ?></option>
<?php } ?>
</select>
<div id="json"></div>
</div>
<script>
var max_queue = 30;
var table = [];
var last = [];
//var socket = io.connect('http://home.gigafreak.net:5001');
var config = {};
var socket = io.connect($( "#source_url" ).val());

function SourceChange() {
  table = [];
  last = [];
  socket.disconnect();
  socket.io.close();
  socket = null;
  socket = io.connect($( "#source_url" ).val(),{'forceNew':true });
  startSocket($( "#source_url" ).val());
  socket.emit('subscribe',{topic:'filter/'+params['filter']+'/'+params['repeater']});
}
$( document ).ready(function() {
  loadSettings();
});
startSocket($( "#source_url" ).val());
function startSocket(url) {
  socket.on('connect', function () {
    if (params['amount'] != undefined) max_queue = params['amount'];
    var table = [];
    var last = [];
    if (params['country']) params['filter'] = params['country'];
    socket.emit('subscribe',{topic:'{"country":"'+params['filter']+'","repeater":"'+params['repeater']+'","unique":"'+params['unique']+'","amount":'+max_queue+'}'});
    socket.on('mqtt', function (msg) {
      var lastraw = JSON.parse(msg.payload);
      try{
      if (params['filter'] && params['filter'] != "null") { 
        if (lastraw['Master'].toString().substring(0,3) != params['filter'] )
          return;
        if (lastraw['LinkName'] == "FastForward" )
          return;
      }
      if (params['repeater']) { 
        if (lastraw['ContextID'].toString() != params['repeater'] )
          return;
      }}catch(err) {}
    
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

      if (lastraw['SourceName'] == undefined || lastraw['SourceName'] == null || lastraw['SourceName'] == "") {
        var Source = CountryImage(scountry) +' ' + lastraw['SourceCall'] + ' (' + lastraw['SourceID'] + ')';
      } else {
        var Source = CountryImage(scountry) +' '+lastraw['SourceCall'] + ' [' + lastraw['SourceName'] + '] (' + lastraw['SourceID'] + ')' 
      }

      if (lastraw['LinkName'] == "FastForward") {
        var Link = CountryImage(rcountry) + " " + rcountry.toUpperCase();
        lastraw['LinkName'] = "Inter country";
      } else {
        var Link = CountryImage(rcountry) + ' ' + lastraw['LinkCall'] + ' (' + lastraw['ContextID'] + ')';
      }

      var ref = "";
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
      //Build table
      var entry = {};
      entry['Time'] = datetime;
      if (params['master'])
        entry['Master'] = lastraw['Master']; 
      entry['Link name'] = lastraw['LinkName'];
      entry['My call'] = Source;
      entry['Source'] = Link; 
      entry['Destination'] = group + ' ' + CountryImage(dcountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID']) +' (' + lastraw['DestinationID'] + ')';
      entry['Reflector'] = ref;
      entry['Options'] = "<nobr>"+TSimage(lastraw['Slot']) + ' ' + options + "</nobr>";
      entry['RSSI'] = lastraw['RSSI']!=0?sMeter(lastraw['RSSI']):'';
      entry['Duration'] = lastraw['Stop']!=0?getCellDuration(lastraw['Stop'] - lastraw['Start']):'';
      entry['Loss rate'] = LossCount;
      if (params['unique'] != "undefined" && params['unique'] != undefined)
        var oindex = functiontofindIndexByKeyValue(last,'SourceID', lastraw['SourceID']);
      else
        var oindex = undefined;
      var index = functiontofindIndexByKeyValue(last,'SessionID', lastraw['SessionID']);
      if (oindex != index && oindex != null 
          && params['unique'] != "undefined" 
          && params['unique'] != undefined) 
      {
        delete last[oindex];
        delete table[oindex];
        var i = 0;
        var tmp_last = [];
        var tmp_table = [];
        for (a in last) {
          var _table = table[a];
          var _last = last[a];
          tmp_table[i] = table[a];
          tmp_last[i] = last[a];
          i++;
        }
        table = tmp_table;
        last = tmp_last;
        console.log("Deleted index: " + oindex);
      }
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
      console.log(table);
      document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-condensed", 'Bla');
    });
  });
}

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
var currentZoom = 100;
function zoom(paramvar)
{
  currentZoom += paramvar;
  document.body.style.zoom =  currentZoom + "%" 
}

function saveSettings(){
  config['mobile'] = $('#mobilemode').is(':checked');
  config['datetime'] = $('#datetime').is(':checked');
  console.log(config['mobile']);
  Cookies.set("bm-lh-data", JSON.stringify(config));
  window.location.reload();
}

function loadSettings() {
  var _config = Cookies.get("bm-lh-data")
  try {
    config = JSON.parse(_config);
  } catch(err) {
    config = {'mobile': false,'datetime': false}
  }
  if (config['mobile'] == undefined) 
    config['mobile'] = false;
  if (config['datetime'] == undefined) 
    config['datetime'] = false;
  if (config['mobile'])
    zoom(+50);
  $('#mobilemode').prop('checked', config['mobile']); 
  $('#datetime').prop('checked', config['datetime']); 
}


</script>

