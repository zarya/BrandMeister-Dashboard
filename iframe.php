<?php
include("config.php");
include("include/header.php");
?>
<body>
            <div id="content" class="span10">
<?php
if ($_GET['page']) {
  if ($_GET['page'] == "lh") include("pages/lh.php");
  if ($_GET['page'] == "repeaters") include("pages/repeaters.php");
  if ($_GET['page'] == "dongles") include("pages/dongles.php");
  if ($_GET['page'] == "reflector") include("pages/reflector.php");
  if ($_GET['page'] == "masters") include("pages/masters.php");
  if ($_GET['page'] == "erouting") include("pages/extended_routing.php");
  if ($_GET['page'] == "display") include("pages/display.php");
  if ($_GET['page'] == "alerts") include("pages/alerts.php");
}else
  include("pages/dashboard.php");
?>    
            <!-- end: Content -->
        </div><!--/#content.span10-->
    
    <!-- start: JavaScript-->
    <script src="js/counter.js"></script>
    <script src="js/custom.js"></script>
    <!-- end: JavaScript-->
</body>
</html>
