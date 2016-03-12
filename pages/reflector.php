    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a> 
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['Connected reflectors']['Reflectors'];?></a></li>
            </ul>

<div class="row-fluid">
<div id="json">
<table id="jsonTable" class="table table-striped table-bordered bootstrap-datatable">
  <thead>
    <tr>
      <th><?php echo $language['Connected reflectors']['Name'];?></th>
      <th><?php echo $language['Connected reflectors']['Reflector'];?></th>
    </tr>
  </thead>
</table>
</div>
</div>
    </div><!--/.fluid-container-->
    <script src="js/bm_common.js"></script>
    <script src="js/connected_reflectors.js"></script>
