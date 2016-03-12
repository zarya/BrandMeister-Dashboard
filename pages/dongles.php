    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a> 
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['Hotspots']['Hotspots'];?></a></li>
            </ul>

<div class="row-fluid">
<div id="json">
<table id="jsonTable" class="table table-striped table-bordered bootstrap-datatable">
  <thead>
    <tr>
      <th><?php echo $language['Hotspots']['Number'];?></th>
      <th><?php echo $language['Hotspots']['Name'];?></th>
      <th><?php echo $language['Hotspots']['Hardware'];?></th>
      <th><?php echo $language['Hotspots']['Firmware'];?></th>
      <th><?php echo $language['Hotspots']['TX'];?></th>
      <th><?php echo $language['Hotspots']['RX'];?></th>
      <th><?php echo $language['Hotspots']['CC'];?></th>
      <th><?php echo $language['Hotspots']['Status'];?></th>
      <th><?php echo $language['Hotspots']['Master'];?></th>
    </tr>
  </thead>
</table>
</div>
</div>
    </div><!--/.fluid-container-->
    <script src="js/dongles.js"></script>
