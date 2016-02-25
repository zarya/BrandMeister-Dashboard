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
include("include/pages.php");
?>    
            <!-- end: Content -->
        </div><!--/#content.span10-->
        </div><!--/fluid-row-->
    <?php include("include/config_menu.php"); ?> 
    <div class="clearfix"></div>
    
    <footer>

        <p>
            <span style="text-align:left;float:left">Application written by PD0ZRY Template: &copy; 2013 <a href="http://jiji262.github.io/Bootstrap_Metro_Dashboard/">Bootstrap Metro Dashboard</a></span>
            
        </p>

    </footer>
    
    <!-- start: JavaScript-->
    <script src="js/counter.js"></script>
    <script src="js/custom.js"></script>
    <!-- end: JavaScript-->
</body>
</html>
