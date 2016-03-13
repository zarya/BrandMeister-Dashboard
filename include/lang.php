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
    case "es":
        $string = file_get_contents("lang/es.json");
        break;        
    case "pl":
        $string = file_get_contents("lang/pl.json");
        break;        
    case "ru":
        $string = file_get_contents("lang/ru.json");
        break; 
    case "fr":
        $string = file_get_contents("lang/fr.json");
        break; 
    case "pt":
        $string = file_get_contents("lang/pt.json");
        break; 
    case "af":
        $string = file_get_contents("lang/af.json");
        break; 
    case "it":
        $string = file_get_contents("lang/it.json");
        break; 
    default:
        $string = file_get_contents("lang/".$config['default language'].".json");
        break;
}
$language = json_decode($string, true);
?>
