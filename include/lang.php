<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if ($_GET['lang']) $lang = $_GET['lang'];
switch ($lang){
    case "en":
        $config['lang'] = 'en';
        $string = file_get_contents("lang/en.json");
        break;        
    case "nl":
        $config['lang'] = 'nl';
        $string = file_get_contents("lang/nl.json");
        break;        
    case "sv":
        $config['lang'] = 'sv';
        $string = file_get_contents("lang/sv.json");
        break;        
    case "de":
        $config['lang'] = 'de';
        $string = file_get_contents("lang/de.json");
        break;        
    case "es":
        $config['lang'] = 'es';
        $string = file_get_contents("lang/es.json");
        break;        
    case "pl":
        $config['lang'] = 'pl';
        $string = file_get_contents("lang/pl.json");
        break;        
    case "ru":
        $config['lang'] = 'ru';
        $string = file_get_contents("lang/ru.json");
        break; 
    case "fr":
        $config['lang'] = 'fr';
        $string = file_get_contents("lang/fr.json");
        break; 
    case "pt":
        $config['lang'] = 'pt';
        $string = file_get_contents("lang/pt.json");
        break; 
    case "af":
        $config['lang'] = 'af';
        $string = file_get_contents("lang/af.json");
        break; 
    case "it":
        $config['lang'] = 'it';
        $string = file_get_contents("lang/it.json");
        break; 
    case "da":
        $config['lang'] = 'da';
        $string = file_get_contents("lang/da.json");
        break; 
    default:
        $config['lang'] = $config['default language'];
        $string = file_get_contents("lang/".$config['default language'].".json");
        break;
}
$language = array_replace_recursive(json_decode(file_get_contents("lang/en.json"),true), json_decode($string, true));
?>
