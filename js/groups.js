var groups =
{
  "2501" : "Russia Global",
  "2502" : "XRF250 Bridge",
  "2505" : "bridge to Radiocult",
  "9504" : "*RUSSIA* (EchoLink)",
  "9" : "DMR Reflector",

  "1" : "World-wide",
  "91" : "World-wide",
  //"1" : "Local",
  "92" : "Europe",
  "2" : "Europe",
  "3" : "North America",
  "5" : "Australia, New Zeland",
  "10" : "German",
  "11" : "French",
  "13" : "English",
  "14" : "Spanish",
  "15" : "Portuguese",
  "20" : "DL, OE, HB9",
  "21" : "French",
  "22" : "Dutch",
  "922" : "Dutch",
  "23" : "European English",

  "9107" : "XRF007 B",
  "214" : "Spain",

  "222" : "Italia",
  "325" : "United Kingdom",
  "262" : "Deutschland",
  "240" : "Market Reef",
  
  "88" : "XRF088 B",
  "881": "XRF088 A",
  "2220" : "XRF390 A",
  "2226" : "XRF055 C",
  "2621" : "XRF262 A",
  "2624" : "XRF423 B",
  "8500" : "XRF003 A",
  "9107" : "XRF007 B",

  "4016" : "Berlin-Brandenburg",
  "4242" : "Norway",
  "4400" : "United Kingdom",
  "4401" : "UK - 1",
  "4402" : "UK - 2",
  "4403" : "UK - 3",
  "235"  : "United Kingdom",
  "2350" : "United Kingdom 4400",
  "2351" : "UK - 1 4401",
  "2352" : "UK - 2 4402",
  "2353" : "UK - 3 4403",

  "7551" : "Belgium Vlaams",
  "4770" : "Hungary",

  "204": "Nederland",
  "2041" : "Noord Nederland",
  "2042" : "Midden Nederland",
  "2043" : "Zuid Nederland",
  "2044" : "Oost Nederland",
  "2049881" : "XRF088 A",
  "2049882" : "XRF088 B",
  "4500" : "Nederland",
  "4501" : "Noord Nederland",
  "4502" : "Midden Nederland",
  "4503" : "Zuid Nederland",
  "4504" : "Oost Nederland",


  "4600" : "Florida",
  "4601" : "Georgia",
  "4602" : "North Carolina",
  "4603" : "Texas",

  "4639" : "USA - Nationwide",
  "4640" : "USA - Area 0",
  "4641" : "USA - Area 1",
  "4642" : "USA - Area 2",
  "4643" : "USA - Area 3",
  "4644" : "USA - Area 4",
  "4645" : "USA - Area 5",
  "4646" : "USA - Area 6",
  "4647" : "USA - Area 7",
  "4648" : "USA - Area 8",
  "4649" : "USA - Area 9",
  "3100" : "USA - Nationwide 4639",
  "31090" : "USA - Area 0 4639",
  "31091" : "USA - Area 1 4641",
  "31092" : "USA - Area 2 4642",
  "31093" : "USA - Area 3 4643",
  "31094" : "USA - Area 4 4644",
  "31095" : "USA - Area 5 4645",
  "31096" : "USA - Area 6 4646",
  "31097" : "USA - Area 7 4647",
  "31099" : "USA - Area 8 4648",
  "31098" : "USA - Area 9 4649",

  "206"  : "Belgium",
  "4750" : "Belgium",
  "4751" : "Belgium Vlaams",
  "4752" : "Belgium Francais",
  "4753" : "Belgium Deutsch",

  "4000" : "Disconnect",
  "5000" : "Ref info",

  "4300": "France IDF",
  "208" : "France IDF",
  "4301": "FRANCE SUD",
  "2081": "FRANCE SUD",
  "4302": "FRANCE SUDEST",
  "2082": "FRANCE SUDEST",
  "4303": "FRANCE SUDOUEST",
  "2083": "FRANCE SUDOUEST",
  "4304": "FRANCE EST",
  "2084": "FRANCE EST",
  "4305": "FRANCE OUEST",
  "2085": "FRANCE OUEST",
  "4306": "FRANCE NORDOUEST",
  "2086": "FRANCE NORDOUEST",
  "4307": "FRANCE NORD",
  "2087": "FRANCE NORD",
  "4308": "FRANCE CENTRE",
  "2088": "FRANCE CENTRE",
  "4309": "FRANCE DOMTOM",
  "2089": "FRANCE DOMTOM",

  "4370" : "XRF007 B",
  
  "5059742" : "XRF740 C"

};

function getGroupName(number)
{
  var value = String(number);
  if (groups.hasOwnProperty(value))
    return groups[value];

  if ((value.length == 3) &&
      (countries != undefined))
    for (key in countries)
      if (countries[key].hasOwnProperty('MCC') &&
         (countries[key]['MCC'] == number))
        return countries[key]['name'];
  return "";
}
