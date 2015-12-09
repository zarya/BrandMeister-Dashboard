<?php
include("config.php");
include("include/header.php");
?>
<body>
<?php
include("include/navbar.php");
?>
    <!-- start: Header -->
    
        <div class="container-fluid-full">
        <div class="row-fluid">
<?php
include("include/menu.php");
?>
            <!-- start: Content -->
            <div id="content" class="span10">
<?php
if ($_GET['page']) {
  if ($_GET['page'] == "lh") include("pages/lh.php");
  if ($_GET['page'] == "repeaters") include("pages/repeaters.php");
  if ($_GET['page'] == "dongles") include("pages/dongles.php");
  if ($_GET['page'] == "reflector") include("pages/reflector.php");
  if ($_GET['page'] == "masters") include("pages/masters.php");
}else
  include("pages/dashboard.php");
?>    
            <!-- end: Content -->
        </div><!--/#content.span10-->
        </div><!--/fluid-row-->
        
    <div class="modal hide fade" id="myModal">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">×</button>
            <h3>Settings</h3>
        </div>
        <div class="modal-body">
            <p>Here settings can be configured...</p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal">Close</a>
            <a href="#" class="btn btn-primary">Save changes</a>
        </div>
    </div>
    
    <div class="clearfix"></div>
    
    <footer>

        <p>
            Application writen by PD0ZRY Template: <span style="text-align:left;float:left">&copy; 2013 <a href="http://jiji262.github.io/Bootstrap_Metro_Dashboard/" alt="Bootstrap_Metro_Dashboard">Bootstrap Metro Dashboard</a></span>
            
        </p>

    </footer>
    
    <!-- start: JavaScript-->
    <script src="js/counter.js"></script>
    <script src="js/retina.js"></script>
    <script src="js/custom.js"></script>
    <!-- end: JavaScript-->
</body>
</html>
