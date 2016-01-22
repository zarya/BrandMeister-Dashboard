    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php">Home</a> 
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#">Dashboard</a></li>
            </ul>

            <div class="row-fluid">
                
                <div class="span3 statbox yellow" onTablet="span6" onDesktop="span3">
                    <div class="number" id="count_rptr"></div>
                    <div class="title">Professional Repeaters</div>
                    <div class="footer">
                      <a href="index.php?page=repeaters">Full report</a>
                    </div>  
                </div>
                <div class="span3 statbox blue" onTablet="span6" onDesktop="span3">
                    <div class="number" id="count_dongle"></div>
                    <div class="title">DV4mini Dongles</div>
                    <div class="footer">
                      <a href="index.php?page=dongles">Full report</a>
                    </div>
                </div>
                <div class="span3 statbox red" onTablet="span6" onDesktop="span3">
                    <div class="number" id="count_homebrew"></div>
                    <div class="title">Homebrew<br>Repeaters / Dongles</div>
                    <div class="footer">
                    </div>
                </div>
                <div class="span3 statbox purple" onTablet="span6" onDesktop="span3">
                    <div class="number" id="count_master"></div>
                    <div class="title">Masters</div>
                    <div class="footer">
                      <a href="index.php?page=masters">Full report</a>
                    </div>
                </div>
            </div>      
            <div class="row-fluid hideInIE8 circleStats">
                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox green">
                        <div class="header">Repeater in RX</div>
                        <div class="circleStat">
                            <input type="text" value="0" class="RepeaterCircle" id="repeater_rx_input" />
                        </div>      
                    </div>
                </div>
                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox red">
                        <div class="header">Repeater in TX</div>
                        <div class="circleStat">
                            <input type="text" value="0" class="RepeaterCircle" id="repeater_tx_input" />
                        </div>      
                    </div>
                </div>
                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox purple">
                        <div class="header">External calls</div>
                        <div class="circleStat">
                            <input type="text" value="0" class="RepeaterCircle" id="external_input" />
                        </div>      
                    </div>
                </div>
            </div>
            <div class="row-fluid">
               <div class="box">
                    <div class="box-header">
                        <h2><i class="halflings-icon list-alt"></i><span class="break"></span>Per country</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="halflings-icon remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                         <div id="country_cnt" class="center" style="margin: 0px 10px 10px 0px; height:300px;"></div>
                         <div id='tooltip' style="position: absolute, display: none, border: 1px solid #fdd, padding: 2px, background-color: #fee, opacity: 0.80, z-index: -1"></div>
                    </div>
                </div> 
            </div>
<div class="row-fluid">
               <div class="box">            
                <div class="box-header">
                        <h2><i class="halflings-icon list-alt"></i><span class="break"></span>Last Heard</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="halflings-icon remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                        <div id="json"></div>
                    </div>
                </div>
</div>
            <div class="row-fluid hideInIE8 circleStats">
<!--                
                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox yellow">
                        <div class="header">Disk Space Usage</div>
                        <span class="percent">percent</span>
                        <div class="circleStat">
                            <input type="text" value="58" class="whiteCircle" />
                        </div>      
                        <div class="footer">
                            <span class="count">
                                <span class="number">20000</span>
                                <span class="unit">MB</span>
                            </span>
                            <span class="sep"> / </span>
                            <span class="value">
                                <span class="number">50000</span>
                                <span class="unit">MB</span>
                            </span> 
                        </div>
                    </div>
                </div>

                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox green">
                        <div class="header">Bandwidth</div>
                        <span class="percent">percent</span>
                        <div class="circleStat">
                            <input type="text" value="78" class="whiteCircle" />
                        </div>
                        <div class="footer">
                            <span class="count">
                                <span class="number">5000</span>
                                <span class="unit">GB</span>
                            </span>
                            <span class="sep"> / </span>
                            <span class="value">
                                <span class="number">5000</span>
                                <span class="unit">GB</span>
                            </span> 
                        </div>
                    </div>
                </div>

                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox greenDark">
                        <div class="header">Memory</div>
                        <span class="percent">percent</span>
                        <div class="circleStat">
                            <input type="text" value="100" class="whiteCircle" />
                        </div>
                        <div class="footer">
                            <span class="count">
                                <span class="number">64</span>
                                <span class="unit">GB</span>
                            </span>
                            <span class="sep"> / </span>
                            <span class="value">
                                <span class="number">64</span>
                                <span class="unit">GB</span>
                            </span> 
                        </div>
                    </div>
                </div>

                <div class="span2 noMargin" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox pink">
                        <div class="header">CPU</div>
                        <span class="percent">percent</span>
                        <div class="circleStat">
                            <input type="text" value="83" class="whiteCircle" />
                        </div>
                        <div class="footer">
                            <span class="count">
                                <span class="number">64</span>
                                <span class="unit">GHz</span>
                            </span>
                            <span class="sep"> / </span>
                            <span class="value">
                                <span class="number">3.2</span>
                                <span class="unit">GHz</span>
                            </span> 
                        </div>
                    </div>
                </div>

                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox orange">
                        <div class="header">Memory</div>
                        <span class="percent">percent</span>
                        <div class="circleStat">
                            <input type="text" value="100" class="whiteCircle" />
                        </div>
                        <div class="footer">
                            <span class="count">
                                <span class="number">64</span>
                                <span class="unit">GB</span>
                            </span>
                            <span class="sep"> / </span>
                            <span class="value">
                                <span class="number">64</span>
                                <span class="unit">GB</span>
                            </span> 
                        </div>
                    </div>
                </div>

                <div class="span2" onTablet="span4" onDesktop="span2">
                    <div class="circleStatsItemBox greenLight">
                        <div class="header">Memory</div>
                        <span class="percent">percent</span>
                        <div class="circleStat">
                            <input type="text" value="100" class="whiteCircle" />
                        </div>
                        <div class="footer">
                            <span class="count">
                                <span class="number">64</span>
                                <span class="unit">GB</span>
                            </span>
                            <span class="sep"> / </span>
                            <span class="value">
                                <span class="number">64</span>
                                <span class="unit">GB</span>
                            </span> 
                        </div>
                    </div>
                </div>
-->                        
            </div>      
                        
            <div class="row-fluid">
            
            </div>
    </div><!--/.fluid-container-->
    <script src="js/bm.js"></script>
<script>
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
</script>
<script type="text/javascript">
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


</script>
