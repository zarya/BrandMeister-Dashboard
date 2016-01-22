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
              <div class="span3 statbox red" onTablet="span6" onDesktop="span3">
                <div class="number" id="count_homebrew"></div>
                <div class="title">Homebrew<br>Repeaters / Hotspots</div>
              </div>
              <div class="span3 statbox blue" onTablet="span6" onDesktop="span3">
                <div class="number" id="count_dongle"></div>
                <div class="title">DV4mini</div>
                <div class="footer">
                  <a href="index.php?page=dongles">Full report</a>
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
    </div><!--/.fluid-container-->
    <script src="js/bm.js"></script>
