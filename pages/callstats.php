    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a> 
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['Calls']['Call statistics'];?></a></li>
            </ul>

<div class="row-fluid">
<div class="box span12">
<div class="box-header" data-original-title>
                        <h2><i class="halflings-icon edit"></i><span class="break"></span><?php echo $language['Calls']['Filters'];?></h2>
                        <div class="box-icon">
                            <a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="halflings-icon remove"></i></a>
                        </div>
                    </div>
<div class="box-content">
                    <form class="form-vertical">
                      <fieldset>
                        <div class="control-group">
                          <div class="controls form-inline">
                            <label class="dropdown"><select id="group-list"><option value="0"n><?php echo $language['Calls']['Talkgroup'];?></option></select></label>
                            <label class="control-label" for="optionsCheckbox2"> <?php echo $language['Calls']['Display Per TG'];?></label>
                            <label class="checkbox"><input type="checkbox" id="group-by-tg"></label>
                            <label class="control-label" for="optionsCheckbox2"> <?php echo $language['Calls']['Display Per reflector'];?></label>
                            <label class="checkbox"><input type="checkbox" id="group-by-ref"></label>
                          </div>
                        </div>
                      </fieldset>
                    </form>
</div>
</div>
</div>
<div class="row-fluid">
<div id="container1" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
</div>
<div class="row-fluid">
<div id="container2" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
</div>
    </div><!--/.fluid-container-->
    <script src="js/callstats.js"></script>
