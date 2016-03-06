<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if ($_GET['lang']) $lang = $_GET['lang'];
switch ($lang){
    case "en":
        $string = file_get_contents("lang/en.json");
        break;        
    default:
        $string = file_get_contents("lang/en.json");
        break;
}
$language = json_decode($string, true);
?>
