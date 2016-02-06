            <ul class="breadcrumb">
              <li>
                <i class="icon-home"></i>
                  <a href="index.php">Home</a> 
                  <i class="icon-angle-right"></i>
                </li>
                <li><a href="#">Display</a></li>
            </ul>
            <div class="row-fluid">
              <div class="box">            
                <div class="box-header">
                  <h2><i class="halflings-icon list-alt"></i><span class="break"></span>Talkgroup Display</h2>
                  <div class="box-icon">
                    <a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
                    <a href="#" class="btn-close"><i class="halflings-icon remove"></i></a>
                  </div>
                </div>
                <div class="box-content">
                  <select id="group-list"><option>Talkgroup</option></select>
                  <table>
                  <tr><th>Time</th><td id="time"></td><th>Options</th><td id="options"></td></tr>
                  <tr><th>Source</th><td id="source"></td><th>Timeslot</th><td id="timeslot"></td></tr>
                  <tr><th>Repeater</th><td id="repeater"></td></tr>
                  <tr><th>Destination</th><td id="destination"></td></tr>
                  </table> 
                </div>
              </div>
            </div>
    </div><!--/.fluid-container-->
    <script src="js/display.js"></script>
