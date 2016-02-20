function getCellDuration(value)
{
  if (isNaN(value))
    return '';
  var seconds = Number(value);
  if (seconds >= 60)
  {
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    var delimiter = (seconds < 10) ? ':0' : ':';
    return minutes + delimiter + seconds.toFixed(0);
  }
  return seconds.toFixed(0);
}

function getCountry(number)
{
  if (String(number).substring(0,4) == "2440") {
    return "ax";
  }
  var value = String(number).substring(0,3);
  if (countries.hasOwnProperty(value))
    return countries[value];
  else
    return "";
}

function CountryImage(country){
  if (country != null && country != "")
    return '<img src="images/flags/png/' + country + '.png" \>';
  else
    return '';
}

function sMeter(rssi) {
    if (rssi > -63) return '<img src="images/indicator/4.png" \> S9+10dB';
    if (rssi > -73) return '<img src="images/indicator/4.png" \> S9';
    if (rssi > -79) return '<img src="images/indicator/3.png" \> S8';
    if (rssi > -85) return '<img src="images/indicator/3.png" \> S7';
    if (rssi > -91) return '<img src="images/indicator/2.png" \> S6';
    if (rssi > -97) return '<img src="images/indicator/2.png" \> S5';
    if (rssi > -103) return '<img src="images/indicator/1.png" \> S4';
    if (rssi > -109) return '<img src="images/indicator/1.png" \> S3';
    if (rssi > -115) return '<img src="images/indicator/0.png" \> S2';
    if (rssi > -121) return '<img src="images/indicator/0.png" \> S1';
    return '<img src="images/indicator/0.png" \> S0';
}

function TSimage(ts) {
  if (ts > 0)
    return '<img src="images/avc/icon_TS' + ts + '.png" \>';
  else
    return '<img src="images/avc/icon_TS.png" \>';
}

function timeSince(date) {
    date = date * 1000
    var seconds = Math.floor((new Date() - date)/1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " Years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " Months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " Days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " Hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " Minutes";
    }
    return Math.floor(seconds) + " Seconds";
}

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
  for (var i = 0; i < arraytosearch.length; i++) {
    if (arraytosearch[i][key] == valuetosearch) {
      return i;
    }
  }
  return null;
}

