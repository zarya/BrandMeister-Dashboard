<?php
include("include/default_config.php");
include("config.php");
include("include/lang.php");
include("include/header.php");
?>
<body>
<?php
if ($_GET['page']) {
  if ($_GET['page'] == "lh") include("pages/lh.php");
  else if ($_GET['page'] == "repeaters") include("pages/repeaters.php");
  else if ($_GET['page'] == "dongles") include("pages/dongles.php");
  else if ($_GET['page'] == "reflector") include("pages/reflector.php");
  else if ($_GET['page'] == "masters") include("pages/masters.php");
  else if ($_GET['page'] == "erouting") include("pages/extended_routing.php");
  else if ($_GET['page'] == "display") include("pages/display.php");
  else if ($_GET['page'] == "alerts") include("pages/alerts.php");
  else if ($_GET['page'] == "callstats") include("pages/callstats.php");
  else include("pages/dashboard.php");
}else
  include("pages/dashboard.php");
?>    
    <!-- start: JavaScript-->
    <script src="js/counter.js"></script>
    <script src="js/custom.js"></script>
    <script src="https://cdn.ravenjs.com/2.2.1/raven.min.js"></script>
    <script>
    Raven.config('http://324f178d24d645cca440c1f936dae6b6@error.maze.io/5').install();
    </script>
    <!-- end: JavaScript-->
</body>
</html>
