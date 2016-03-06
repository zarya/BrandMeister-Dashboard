    <div class="modal hide fade" id="modal_config">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">×</button>
            <h3>Settings</h3>
        </div>
        <div class="modal-body">
            <div class="tabbable">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#config_tab_general" data-toggle="tab"><?php echo $language['ConfigDialog']['General'];?></a></li>
                    <li><a href="#config_tab_lh" data-toggle="tab"><?php echo $language['ConfigDialog']['LastHeard'];?></a></li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane active" id="config_tab_general">
                    <form class="form-horizontal">
                      <fieldset>
                        <div class="control-group">
                          <label class="control-label" for="optionsCheckbox2"> <?php echo $language['ConfigDialog']['Display alerts'];?></label> 
                          <div class="controls">
                            <label class="checkbox"><input type="checkbox" id="alerts_enabled"></label>
                          </div>
                        </div>
                        <div class="control-group">
                          <label class="control-label" for="typeahead"><?php echo $language['ConfigDialog']['API Timeout'];?> </label>
                          <div class="controls">
                            <input type="input" id="json_timeout">
                            <p class="help-block"><?php echo $language['ConfigDialog']['API Timeout Max'];?></p>
                          </div>
                        </div>
                      <fieldset>
                    </form>
                  </div>
                  <div class="tab-pane" id="config_tab_lh">
                    <div class="checkbox">
                      <label><input type="checkbox" id="datetime"> <?php echo $language['ConfigDialog']['TimeQSO'];?></label>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal"><?php echo $language['ConfigDialog']['Close'];?></a>
            <a href="#" onclick="saveSettings();" class="btn btn-primary"><?php echo $language['ConfigDialog']['Save'];?></a>
        </div>
    </div>
