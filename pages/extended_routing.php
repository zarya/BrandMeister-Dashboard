    <ul class="breadcrumb">
                <li>
                    <i class="icon-home"></i>
                    <a href="index.php"><?php echo $language['Home'];?></a> 
                    <i class="icon-angle-right"></i>
                </li>
                <li><a href="#"><?php echo $language['Extended routing']['Extended routing'];?></a></li>
            </ul>

<div class="row-fluid">
<!-- Things here -->
      <div class="page-header">
        <h1><?php echo $language['Extended routing']['Extended Routing for DV4mini'];?></h1>
      </div>
<div id="alert-area"></div>
      <form action="javascript:link()" class="form-horizontal" style="padding: 16px;">
        <div class="form-group">
          <label for="number"><?php echo $language['Extended routing']['User ID'];?></label>
          <select name="number" id="dongle-list"><option><?php echo $language['Extended routing']['Choose dongle'];?></option> </select>
        </div>
        <div class="form-group">
          <label for="group"><?php echo $language['Extended routing']['Mapped group'];?></label>
          <input id="group" type="text" class="form-control"> <select id="group-list"><option><?php echo $language['Extended routing']['Talkgroup'];?></option></select>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary"><?php echo $language['Extended routing']['OK'];?></button>
        </div>
      </form>
<?php echo $language['Extended routing']['help'];?>: <a href="https://bm.pd0zry.nl/index.php/Extended_routing_for_DV4mini"><?php echo $language['Extended routing']['Extended Routing for DV4mini'];?></a>
</div>
    </div><!--/.fluid-container-->
    <script src="js/extended_routing.js"></script>
