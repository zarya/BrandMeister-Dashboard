  <ul class="breadcrumb">
    <li>
      <i class="icon-home"></i>
      <a href="index.php"><?php echo $language['Home'];?></a>
      <i class="icon-angle-right"></i>
    </li>
    <li><a href="#"><?php echo $language['LH']['LastHeard'];?></a></li>
  </ul>
  <div class="row-fluid"> 
    <div class="box">
      <div class="box-header">
        <h2>Search</h2>
        <div class="box-icon">
          <a href="#" class="btn-minimize"><i class="halflings-icon chevron-down"></i></a>
        </div>
      </div>
      <div class="box-content" style="display: none;">
        <div id="query-builder"></div>
        <div style="height:40px">
          <div style="float:left">
            <button type="button" class="btn btn-default" id="query-builder-sqlImport">Load SQL</button>
          </div>
          <div style="float:right">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="query-builder-search">Search</button>
          </div>
        </div>
      </div> <!-- /box-content --> 
    </div> <!-- /box -->
  </div> <!-- /row-fluid -->
  <div class="row-fluid">
    <div>
      <button onclick="javascript:simpleMode()">Simplemode</button>
      <button onclick="javascript:fullMode()">Uber advanced mode</button>
      <button onclick="javascript:activeOnly()">Active only</button>
    </div>
  </div>
  <div class="row-fluid">
    <div>

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
    </div>
  </div>
  <!--</div>-->
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
var table_queue = max_queue;
if (params['tableAmount'] != undefined) table_queue = params['tableAmount'];
var table = [];
var last = [];
var urlreg = /(.+:\/\/?[^\/]+)(\/.*)*/;
var pathname = urlreg.exec( $( "#source_url" ).val() );
var options = {};
var socket;


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
  startSocket($( "#source_url" ).val());
  setInterval(tableUpdater, 1000)
  initQueryBuilder();
  LHloadConfig();
});


function initQueryBuilder()
{

  $('#query-builder-sqlImport').on('click', function() {
    var sql_import_export = prompt("SQL", "") 
    $('#query-builder').queryBuilder('setRulesFromSQL', sql_import_export);
  });
  $('#query-builder-search').on('click', function() {
    var result = $('#query-builder').queryBuilder('getRules');
    
    var query = {};
    delete params['ContextID']; 
    delete params['Master']; 
    delete params['DestinationID']; 
    delete params['SourceID']; 
    delete params['SourceCall']; 
    delete params['LinkCall']; 
    delete params['aggr']; 
    delete params['ReflectorID']; 
    if (!$.isEmptyObject(result)) {
      for (index in result['rules'])
      {
        query[result['rules'][index]['id']]=result['rules'][index]['value'] 
        params[result['rules'][index]['id']]=result['rules'][index]['value'] 
      }
      console.log(query)
    }
    FilterChange(query);
    var search_dialog = $('#modal_search');
    search_dialog.modal('hide');
  });

  var query = buildQuery();
  var rules = [];
  for (index in query)
  {
    rules.push({'id': index,'value':query[index]});
  }

  $('#query-builder').queryBuilder({
    allow_groups: false,
    conditions: ['AND'],
    allow_empty: true,
    filters: [
      {
        id: 'Master',
        label: 'Master ID',
        type: 'string',
        operators: ['equal']
      },
      {
        id: 'SourceCall',
        label: 'My Call',
        type: 'string',
        operators: ['equal']
      },
      {
        id: 'SourceID',
        label: 'My ID',
        type: 'integer',
        operators: ['equal']
      },
      {
        id: 'ContextID',
        label: 'Source ID',
        type: 'string',
        operators: ['equal']
      },
      {
        id: 'LinkCall',
        label: 'Source Call',
        type: 'string',
        operators: ['equal']
      },
      {
        id: 'DestinationID',
        label: 'Destination ID',
        type: 'integer',
        operators: ['equal']
      },
      {
        id: 'ReflectorID',
        label: 'Reflector',
        type: 'integer',
        operators: ['equal']
      },
      {
        id: 'aggr',
        label: 'Unique',
        type: 'integer',
        input: 'radio',
        values: {
          1: 'Yes',
          0: 'No'
        },
        operators: ['equal']
      }
    ],
    rules: {
      condition: 'AND',
      rules: rules
    } 
  });
}

function simpleMode() {
  //                     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4
  config['lh-table'] = "[0,1,0,0,1,1,1,1,0,1,0,1,0,0,0]"
  LHloadConfig();
}

function fullMode() {
  //                     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4
  config['lh-table'] = "[1,1,1,1,1,1,1,1,1,1,0,1,1,0,0]"
  LHloadConfig();
}

function activeOnly()
{
  $('#lhTable').DataTable().column([13]).search('0').redraw()
  table_queue = 100;
}

function LHloadConfig() {
  var lhTable = $('#lhTable').DataTable();
  lhConfig = JSON.parse(config['lh-table']);
  for (i = 0; i < 15; i++) {
    lhTable.column(i).visible(lhConfig[i]);
  }
}
function SourceChange() {
  table = [];
  last = [];
  socket.disconnect();
  socket.io.close();
  socket = null;
  $('#lhTable').DataTable().clear();
  var pathname = urlreg.exec( $( "#source_url" ).val() );
  var options = {'forceNew':true};

  if (pathname[2]) options['path'] = pathname[2];
  if (pathname[0].charAt(4) == "s") options['secure'] = true;

  socket = io.connect(pathname[1],options);

  startSocket($( "#source_url" ).val());
  socket.emit("searchHistory",{query:buildQuery(),'amount' : max_queue});
}

function FilterChange(filter) {
  table = [];
  last = [];
  socket.disconnect();
  socket.io.close();
  socket = null;
  $('#lhTable').DataTable().clear();
  var pathname = urlreg.exec( $( "#source_url" ).val() );
  var options = {'forceNew':true};

  if (pathname[2]) options['path'] = pathname[2];
  if (pathname[0].charAt(4) == "s") options['secure'] = true;

  socket = io.connect(pathname[1],options);

  startSocket($( "#source_url" ).val());
  socket.emit("searchHistory",{query:filter,'amount' : max_queue});
}

function startSocket(url) {
  socket.on('connect', function () {
    var table = [];
    var last = [];
    if (params['country']) params['ContextID'] = "^"+params['country'];
    if (params['repeater']) params['ContextID'] = "^"+params['repeater'];
    socket.emit("searchHistory",{query:buildQuery(),'amount' : max_queue});

    //Handle incomming message
    socket.on('mqtt', function (msg) {
      var lastraw = JSON.parse(msg.payload);
      //Check incomming message agains active filters
      if (processFilter(lastraw)) return;

      //Format SourceCall
      if (lastraw['SourceCall'] == '')
        lastraw['SourceCall'] = getGroupName(lastraw['SourceID'],lastraw['Master']);

      var dataTablesEntry = [];
      dataTablesEntry.push(lastraw['SessionID']);      //0
      dataTablesEntry.push(formatLHDate(lastraw));     //1
      dataTablesEntry.push(lastraw['Master']);         //2
      dataTablesEntry.push(formatLHLinkName(lastraw)); //3
      dataTablesEntry.push(formatLHSource(lastraw));   //4
      dataTablesEntry.push(formatLHLink(lastraw));     //5
      dataTablesEntry.push(formatLHGroup(lastraw));    //6
      dataTablesEntry.push(formatLHReflector(lastraw));//7
      dataTablesEntry.push(formatLHOptions(lastraw));  //8
      dataTablesEntry.push(lastraw['RSSI']!=0?sMeter(lastraw['RSSI']):' '); //9
      dataTablesEntry.push(lastraw['RSSI']!=0?lastraw['RSSI']:' ');         //10
      dataTablesEntry.push(lastraw['Stop']!=0?getCellDuration(lastraw['Stop'] - lastraw['Start']):' '); //11
      dataTablesEntry.push(formatLHLoss(lastraw));     //12

      //Dont show old partialy missed calls as active calls
      if (lastraw['Stop']==0 && lastraw['Start']*1000 > (Date.now() - 5*60*1000))
        dataTablesEntry.push('0')                      //13
      else
        dataTablesEntry.push('1')                      //13

      //Keep timestamp in table for sorting and tracking calls
      dataTablesEntry.push(lastraw['Stop']!=0?lastraw['Stop']*1000:lastraw['Start']*1000);     //14

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
          if (tableData.length > table_queue) {
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

function processFilter(data)
{
  if (params['ContextID'])
  {
    var re = new RegExp(params['ContextID']);
    if (re.test(data['ContextID']) == false)
      return true;
  }
  if (params['Master'])
  {
    var re = new RegExp(params['Master']);
    if (re.test(data['Master']) == false)
      return true;
  }
  if (params['DestinationID'])
  {
    if (data['DestinationID'] != params['DestinationID'])
      return true;
  }
  if (params['SourceID'])
  {
    if (data['SourceID'] != params['SourceID'])
      return true;
  }
  if (params['SourceCall'])
  {
    var re = new RegExp(params['SourceCall']);
    if (re.test(data['SourceCall']) == false)
      return true;
  }
  if (params['LinkCall'])
  {
    var re = new RegExp(params['LinkCall']);
    if (re.test(data['LinkCall']) == false)
      return true;
  }
  if (params['ReflectorID'])
  {
    if (data['ReflectorID'] != params['ReflectorID'])
      return true;
  }
  return false;
}

function buildQuery()
{
  var query = {}
  if (params['ContextID'])
    query['ContextID'] = params['ContextID'];
  if (params['Master'])
    query['Master'] = params['Master'];
  if (params['DestinationID'])
    query['DestinationID'] = params['DestinationID'];
  if (params['SourceID'])
    query['SourceID'] = params['SourceID'];
  if (params['SourceCall'])
    query['SourceCall'] = params['SourceCall'];
  if (params['LinkCall'])
    query['LinkCall'] = params['LinkCall'];
  if (params['unique'])
    query['aggr'] = 1;
  if (params['ReflectorID'])
    query['ReflectorID'] = params['ReflectorID'];
  return query;
}

function formatLHOptions(lastraw)
{
  options = "";
  if (lastraw['LinkName'] == "D-Extra Link" || lastraw['LinkName'] == "DCS Link")
    options = "<img src=images/avc/icon_D-STAR.png \>";
  else
    options = "<img src=images/avc/icon_DMR_w.png \>";
  return "<nobr>"+TSimage(lastraw['Slot']) + ' ' + options+"</nobr>"; 
}

function formatLHSource(lastraw)
{
  var sCountry = getCountry(lastraw['SourceID']);
  if (lastraw['SourceName'] == undefined || lastraw['SourceName'] == null || lastraw['SourceName'] == "")
    return CountryImage(sCountry) +' ' + lastraw['SourceCall'] + ' (' + lastraw['SourceID'] + ')';
  else
    return CountryImage(sCountry) +' '+lastraw['SourceCall'] + ' [' + lastraw['SourceName'] + '] (' + lastraw['SourceID'] + ')' 
}

function formatLHLink(lastraw)
{
  var rCountry = getCountry(lastraw['ContextID']);
  if (lastraw['LinkName'] == "FastForward") {
    var Link = CountryImage(rCountry) + " " + rCountry.toUpperCase();
    lastraw['LinkName'] = "Inter country";
  } else {
    return CountryImage(rCountry) + ' ' + lastraw['LinkCall'] + ' (' + lastraw['ContextID'] + ')';
  }
}

function formatLHGroup(lastraw)
{
  var group = "";
  var hoseline = "";
  var dCountry = getCountry(lastraw['DestinationID']);
  if (lastraw['CallTypes'].indexOf("Group") > -1)
    group = '<img src="images/batch/users.png" \>';
  else if(lastraw['CallTypes'].indexOf("Voice") > -1)
    group = '<img src="images/batch/user.png" \>';
  if (lastraw['DestinationID'] != 2 && lastraw['DestinationID'] != 9 && lastraw['CallTypes'].indexOf("Group") > -1 && !isGroupMapped(lastraw['DestinationID'],lastraw['Master']))
    hoseline = " <a target=\"_blank\" href=\"http://hose.brandmeister.network/"+lastraw['DestinationID']+"/\"><i class=\"icon-volume-up\">&nbsp;</i></a>";
  group = group + hoseline + ' ' + CountryImage(dCountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID'],lastraw['Master']) +' (' + getGroupFormatting(lastraw['DestinationID'],lastraw['Master']) + ')';
  return group;
}

function formatLHLinkName(lastraw)
{
  if (lastraw['LinkName'] == "FastForward")
    return "Inter country";
  return lastraw['LinkName'];
}

function formatLHReflector(lastraw)
{
  var ref = "";
  if (lastraw['ReflectorID'] != undefined)
    ref = getGroupName(lastraw['ReflectorID'],lastraw['Master']) + ' (' + lastraw['ReflectorID'] + ')';
  return ref
}

function formatLHDate(lastraw)
{
  if (config['datetime']) {
    var timestamp = lastraw['Start'];
    var date = new Date(timestamp * 1000);
    var datetime = date.format('yyyy-mm-dd HH:MM:ss');
  }
  else
    var datetime = timeSince(lastraw['Start']);
  return datetime;
}

function formatLHLoss(lastraw)
{
  var LossCount = "";
  if (lastraw['TotalCount']!=0 && lastraw['TotalCount'] != "undefined") {
    var _percent = Math.round(lastraw['LossCount'] / lastraw['TotalCount'] * 10000) / 100;
    LossCount = _percent + "% (" + lastraw['LossCount'] + "/" + lastraw['TotalCount'] + ")";
  }
  return LossCount;
}
</script>
