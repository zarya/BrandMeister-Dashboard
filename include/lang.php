<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if ($_GET['lang']) $lang = $_GET['lang'];
switch ($lang){
    case "en":
        $string = file_get_contents("lang/en.json");
        break;        
    case "nl":
        $string = file_get_contents("lang/nl.json");
        break;        
    case "sv":
        $string = file_get_contents("lang/sv.json");
        break;        
    case "de":
        $string = file_get_contents("lang/de.json");
        break;        
    case "se":
        $string = file_get_contents("lang/se.json");
        break;        
    default:
        $string = file_get_contents("lang/en.json");
        break;
}
$language = json_decode($string, true);
?>
