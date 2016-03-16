    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a>
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['LH']['LastHeard'];?></a></li>
            </ul>
<button onclick="javascript:simpleMode()">Simplemode</button>
<button onclick="javascript:fullMode()">Uber advanced mode</button>
<button onclick="javascript:activeOnly()">Active only</button>
<table id="lhTable" class="table table-striped table-bordered bootstrap-datatable">
  <thead>
    <tr>
      <th><?php echo $language['LH']['SessionID'];?></th>
      <th><?php echo $language['LH']['Time'];?></th>
      <th><?php echo $language['LH']['Master'];?></th>
      <th><?php echo $language['LH']['Link name'];?></th>
      <th><?php echo $language['LH']['My call'];?></th>
      <th><?php echo $language['LH']['Source'];?></th>
      <th><?php echo $language['LH']['Destination'];?></th>
      <th><?php echo $language['LH']['Reflector'];?></th>
      <th><?php echo $language['LH']['Options'];?></th>
      <th><?php echo $language['LH']['RSSI'];?></th>
      <th>dBm</th>
      <th><?php echo $language['LH']['Duration'];?></th>
      <th><?php echo $language['LH']['Loss rate'];?></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
</table>
<div id="json"></div>
</div>
<Select id="source_url" name="source_url" onchange="javascript:SourceChange()">
<?php
while (list($key, $value) = each($config['LHServers'])) {
?>
<option value="<?php echo $value['url']; ?>"><?php echo $value['Name']; ?></option>
<?php } ?>
</select>
<script>
var max_queue = 30;
if (params['amount'] != undefined) max_queue = params['amount'];
var table = [];
var last = [];
var urlreg = /(.+:\/\/?[^\/]+)(\/.*)*/;
var pathname = urlreg.exec( $( "#source_url" ).val() );
var options = {};
var socket;

function activeOnly()
{
  $('#lhTable').DataTable().column([13]).search('0').redraw()
}

if (pathname[2]) options['path'] = pathname[2];
if (pathname[0].charAt(4) == "s") options['secure'] = true;

$(document).ready(function() {
  socket = io.connect(pathname[1],options);

  var lhTable = $('#lhTable').DataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
    "sPaginationType": "bootstrap",
    "language": php_lang['Table']['DataTables'],
    "lengthMenu": [ [50, -1], [50, php_lang['Table']['All']] ],
    "createdRow" : function( row, data, index ) {
      if( data[0] ) {
        row.id = data[0];
      }       
    },
    "bPaginate": false,
    "aaSorting": [[]],
    "order": [[13,"asc"],[ 14, "desc" ]],
    "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
      if ( aData[13] == "0" )
        $('td', nRow).css('background-color', 'rgba(0, 128, 128, 0.2)');
      else
        $('td', nRow).css('background-color', '');
    }
  } );
  lhTable.column(0).visible(0);
  lhTable.column(2).visible(0);
  lhTable.column(13).visible(0);
  lhTable.column(14).visible(0);
  startSocket($( "#source_url" ).val());
  setInterval(tableUpdater, 1000)
  lhTable.find("th").off("click.DT"); 
});

function simpleMode() {
  var lhTable = $('#lhTable').DataTable();
  lhTable.column(0).visible(0);
  lhTable.column(2).visible(0);
  lhTable.column(12).visible(0);
  lhTable.column(13).visible(0);
  lhTable.column(3).visible(0);
  lhTable.column(8).visible(0);
  lhTable.column(10).visible(0);
  lhTable.column(12).visible(0);
  lhTable.column(13).visible(0);
  lhTable.column(14).visible(0);
}

function fullMode() {
  var lhTable = $('#lhTable').DataTable();
  lhTable.column(0).visible(1);
  lhTable.column(2).visible(1);
  lhTable.column(3).visible(1);
  lhTable.column(8).visible(1);
  lhTable.column(9).visible(1);
  lhTable.column(11).visible(1);
  lhTable.column(12).visible(1);
  lhTable.column(13).visible(1);
  lhTable.column(14).visible(1);
}

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
      if (lastraw['LinkName'] == "D-Extra Link" || lastraw['LinkName'] == "DCS Link")
        options = "<img src=images/avc/icon_D-STAR.png \>";
      else
        options = "<img src=images/avc/icon_DMR_w.png \>";

      if (lastraw['CallTypes'].indexOf("Group") > -1)
        group = '<img src="images/batch/users.png" \>';
      else if(lastraw['CallTypes'].indexOf("Voice") > -1)
        group = '<img src="images/batch/user.png" \>';

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
        var datetime = timeSince(lastraw['Start']);

      var LossCount = "";
      if (lastraw['TotalCount']!=0 && lastraw['TotalCount'] != "undefined") {
        var _percent = Math.round(lastraw['LossCount'] / lastraw['TotalCount'] * 10000) / 100;
        LossCount = _percent + "% (" + lastraw['LossCount'] + "/" + lastraw['TotalCount'] + ")";
      }

      group = group + ' ' + CountryImage(dcountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID'],lastraw['Master']) +' (' + getGroupFormatting(lastraw['DestinationID'],lastraw['Master']) + ')';

      var dataTablesEntry = [];
      dataTablesEntry.push(lastraw['SessionID']); //0
      dataTablesEntry.push(datetime);             //1
      dataTablesEntry.push(lastraw['Master']);    //2
      dataTablesEntry.push(lastraw['LinkName']);  //3
      dataTablesEntry.push(Source);               //4
      dataTablesEntry.push(Link);                 //5
      dataTablesEntry.push(group);                //6
      dataTablesEntry.push(ref);                  //7
      dataTablesEntry.push("<nobr>"+TSimage(lastraw['Slot']) + ' ' + options + "</nobr>"); //8
      dataTablesEntry.push(lastraw['RSSI']!=0?sMeter(lastraw['RSSI']):' ');                //9
      dataTablesEntry.push(lastraw['RSSI']!=0?lastraw['RSSI']:' ');                //10
      dataTablesEntry.push(lastraw['Stop']!=0?getCellDuration(lastraw['Stop'] - lastraw['Start']):' '); //11
      dataTablesEntry.push(LossCount);            //12

      //Dont show old partialy missed calls as active calls
      if (lastraw['Stop']==0 && lastraw['Start']*1000 > (Date.now() - 5*60*1000))
        dataTablesEntry.push('0')                 //13
      else
        dataTablesEntry.push('1')                 //13

      //Keep timestamp in table for sorting and tracking calls
      dataTablesEntry.push(lastraw['Start']*1000);//14

      //Init datatable API
      var lhTable = $('#lhTable').DataTable();

      //Fetch row to update
      var oldTableData = lhTable.row('#'+lastraw['SessionID']);

      if (oldTableData.data()) //If there is a row update it with the new data
        oldTableData.data(dataTablesEntry)

      else
      {
        //Check if session start else dont add row or LH-Startup
        if (lastraw['Event'] == "Session-Start" || msg.topic == 'LH-Startup')
        {
          //Add the row to the table
          lhTable.row.add(dataTablesEntry);

          //Clean up table
          var tableData = lhTable.data();
          if (tableData.length > max_queue) {
            var clearUpRunner = true;
            var clearUpRunnerIndex = 0;
            while (clearUpRunner) {
              var lastRow = lhTable.row('#'+tableData[clearUpRunnerIndex][0])
              if (lastRow.data()[13] == "1" || parseInt(lastRow.data()[14]) < (Date.now() - 5*60*1000) )
              {
                clearUpRunner = false;
                lastRow.remove();
              }else clearUpRunnerIndex++;
            }
          }
        }
      }
      lhTable.draw();
    });
  });
}

function tableUpdater()
{
  var lhTable = $('#lhTable').DataTable();
  data = lhTable.data();
  console.log(data.length);
  for (index in data)
  {
    if (data[index][13] == "0")
    {
      seconds = Date.now() - parseInt(data[index][14]);
      data[index][11] = Math.round(seconds/1000) + " Sec.";
      lhTable.row('#'+data[index][0]).data(data[index]); 
    }
  }
  lhTable.draw(false);
}
</script>
