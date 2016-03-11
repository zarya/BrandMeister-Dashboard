    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a>
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['LH']['LastHeard'];?></a></li>
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
if (params['amount'] != undefined) max_queue = params['amount'];
var table = [];
var last = [];
var urlreg = /(.+:\/\/?[^\/]+)(\/.*)*/;
var pathname = urlreg.exec( $( "#source_url" ).val() );
var options = {};

if (pathname[2]) options['path'] = pathname[2];
if (pathname[0].charAt(4) == "s") options['secure'] = true;

var socket = io.connect(pathname[1],options);

function SourceChange() {
  table = [];
  last = [];
  socket.disconnect();
  socket.io.close();
  socket = null;
  var pathname = urlreg.exec( $( "#source_url" ).val() );
  var options = {'forceNew':true};

  if (pathname[2]) options['path'] = pathname[2];
  if (pathname[0].charAt(4) == "s") options['secure'] = true;

  socket = io.connect(pathname[1],options);

  startSocket($( "#source_url" ).val());
  socket.emit('subscribe',{topic:'{"country":"'+params['filter']+'","repeater":"'+params['repeater']+'","unique":"'+params['unique']+'","amount":'+max_queue+'}'});
}

startSocket($( "#source_url" ).val());

function startSocket(url) {
  socket.on('connect', function () {
    var table = [];
    var last = [];
    if (params['country']) params['filter'] = params['country'];

    //Send registration and filters
    socket.emit('subscribe',{topic:'{"country":"'+params['filter']+'","repeater":"'+params['repeater']+'","unique":"'+params['unique']+'","amount":'+max_queue+'}'});

    //Handle incomming message
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
        lastraw['SourceCall'] = getGroupName(lastraw['SourceID'],lastraw['Master']);

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
      //Build table
      var entry = {};
      entry[php_lang['LH']['Time']] = datetime;
      if (params['master'])
        entry[php_lang['LH']['Master']] = lastraw['Master'];
      if (params['SessionID'])
        entry[php_lang['LH']['SessionID']] = lastraw['SessionID']; 
      entry[php_lang['LH']['Link name']] = lastraw['LinkName'];
      entry[php_lang['LH']['My call']] = Source;
      entry[php_lang['LH']['Source']] = Link; 
      entry[php_lang['LH']['Destination']] = group + ' ' + CountryImage(dcountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID'],lastraw['Master']) +' (' + getGroupFormatting(lastraw['DestinationID'],lastraw['Master']) + ')';
      entry[php_lang['LH']['Reflector']] = ref;
      entry[php_lang['LH']['Options']] = "<nobr>"+TSimage(lastraw['Slot']) + ' ' + options + "</nobr>";
      entry[php_lang['LH']['RSSI']] = lastraw['RSSI']!=0?sMeter(lastraw['RSSI']):'';
      entry[php_lang['LH']['Duration']] = lastraw['Stop']!=0?getCellDuration(lastraw['Stop'] - lastraw['Start']):'';
      entry[php_lang['LH']['Loss rate']] = LossCount;
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
      document.getElementById("json").innerHTML = ConvertJsonToTable(table, 'jsonTable', "table table-striped table-condensed", 'Bla');
    });
  });
}

var currentZoom = 100;
function zoom(paramvar)
{
  currentZoom += paramvar;
  document.body.style.zoom =  currentZoom + "%" 
}

</script>
