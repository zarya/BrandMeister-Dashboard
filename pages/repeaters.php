    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a> 
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['Repeaters']['Repeaters'];?></a></li>
            </ul>

<div class="row-fluid">
<div id="json">
<table id="jsonTable" class="table table-striped table-bordered bootstrap-datatable">
  <thead>
    <tr>
      <th><?php echo $language['Repeaters']['Number'];?></th>
      <th><?php echo $language['Repeaters']['Name'];?></th>
      <th><?php echo $language['Repeaters']['Hardware'];?></th>
      <th><?php echo $language['Repeaters']['Firmware'];?></th>
      <th><?php echo $language['Repeaters']['TX'];?></th>
      <th><?php echo $language['Repeaters']['RX'];?></th>
      <th><?php echo $language['Repeaters']['CC'];?></th>
      <th><?php echo $language['Repeaters']['Status'];?></th>
      <th><?php echo $language['Repeaters']['Master'];?></th>
    </tr>
  </thead>
</table>
</div>
</div>
    </div><!--/.fluid-container-->
    <script src="js/repeaters.js"></script>
