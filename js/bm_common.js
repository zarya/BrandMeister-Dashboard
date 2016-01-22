function interpretData(name, type, data)
{
  var messages = [  ];

  // Repeaters

  if (type == 1)
  {
    var reflector = data[data.length - 1];
    if ((reflector > 4000) &&
        (reflector < 5000))
      messages.push('DCS ' + reflector);
  }

  if (name == 'Motorola IP Site Connect')
  {
    var systems = [ 'Unknown', 'IPSC', 'CPC', 'Generic', 'LCP' ];
    messages.push(systems[data[2] >> 10] + ' ' + (data[2] & 0xff));
    if (((data[2] & 0xff) >= 6) &&
        ((data[1] & 0x40000000) != 0))
      messages.push('Voting is On');
    if ((data[1] & 0x10) != 0)
      messages.push('Authentication is On');
    if (data[6] == 0)
      messages.push('XNL is not connected');
    if ((data[0] & 0x0f) == 1)
      messages.push('Slot 1 is Off');
    if ((data[0] & 0x0f) == 4)
      messages.push('Slot 2 is Off');
    if ((data[0] & 0x0f) == 5)
      messages.push('Slots 1 &amp; 2 are Off');
    if ((data[0] & 0xc0) != 0x40)
    {
      var statuses = [ 'Disabled', 'Enabled', 'Knocked Down', 'Locked' ];
      messages.push(statuses[data[0] >> 6]);
    }
  }

  if (name == 'Hytera Multi-Site Connect')
  {
    if (data[2] == 0)
      messages.push('RDAC is Off');
  }

  if (name == 'DV4mini')
  {
    if (data[data.length - 1] == 4999)
      messages.push('TG ' + data[data.length - 2]);
  }

  // Networks

  if (name == 'FastForward')
  {
    if (data[0] > 0)
      messages.push('Encryption is On');
  }

  if (name == 'WinMaster')
  {
    var statuses = { false: 'Connecting', true: 'Connected' };
    messages.push(statuses[data[2] > 0]);
  }

  if (name == 'CBridge CC-CC Link')
  {
    var value = '';
    for (var index = 2; index < data.length; index ++)
      value +=
        String.fromCharCode( data[index]        & 0xff) +
        String.fromCharCode((data[index] >>  8) & 0xff) +
        String.fromCharCode((data[index] >> 16) & 0xff) +
        String.fromCharCode( data[index] >> 24);
    messages.push(value.trim());
    messages.push(data[0] + ' links');
    messages.push(data[1] + ' calls');
  }

  // Applications

  if (name == 'D-Extra Link')
  {
    var number = '00' + data[2]
    var statuses = [ 'Disconnected', 'Connecting', 'Connected' ];
    messages.push('XRF' + number.substr(-3) + ' ' + String.fromCharCode(data[1]));
    messages.push('TG ' + data[4]);
    messages.push(statuses[data[3]]);
  }

  if (name == 'DCS Link')
  {
    var number = '00' + data[2]
    var statuses = [ 'Disconnected', 'Connecting', 'Connected' ];
    messages.push('DCS' + number.substr(-3) + ' ' + String.fromCharCode(data[1]));
    messages.push('TG ' + data[4]);
    messages.push(statuses[data[3]]);
  }

  if (name == 'AutoPatch')
  {
    if ((data[0] == 0) &&  // CORD_MODE_GROUP
        (data[6] == 2))    // CORD_HOOK_TARGET_ID
      messages.push('TG ' + data[2]);
  }

  return messages.join(', ');
}

function getStateDescription(state)
{
  var message = '-';
  if ((state & 0x03) != 0)
      message = 'Busy';
  if (((state & 0x0c) != 0) &&
      ((state & 0x30) == 0))
      message = 'Slot 1 Busy';
  if (((state & 0x0c) == 0) &&
      ((state & 0x30) != 0))
      message = 'Slot 2 Busy';
  if (((state & 0x0c) != 0) &&
      ((state & 0x30) != 0))
      message = 'Slots 1 &amp; 2 Busy';
  return message;
}

function getSuitableStyle(name, state, data)
{
  // Link has an outgoing lock
  if ((state & 0x2a) != 0)
    return 'danger';
  // Link has an incoming lock
  if ((state & 0x15) != 0)
    return 'success';
  // CC-CC Link has one or more active calls
  if ((name == 'CBridge CC-CC Link') &&
      (data[1] > 0))
    return 'info';
  // Link has no specific state attributes
  return '';
}

function getRepeaterModel(value)
{
  var expression = /^T(3000|2003)/;
  if (expression.test(value))
    return 'Motorola MTR3000';

  // --------------- M27QPR9JA7AN
  var expression = /^M27..R9JA7AN/;
  if (expression.test(value))
    return 'Motorola DR3000';

  // --------------- M27JNR9JA7BN
  var expression = /^M27..R9JA7[BC]N/;
  if (expression.test(value))
    return 'Motorola XPR8400';
  
  // --------------- R10JCGAPQ1AN
  var expression = /^R10..GA.Q1AN/;
  if (expression.test(value))
    return 'Motorola SLR5500';

  // ---------------- RD985-00000000-001000-U1-0-F
  // ---------------- RD985-0000000S-001000-U1-0-F
  // ---------------- RD965-000G0000-001000-U1-0-B
  var expression = /^(RD[0-9]{3})-[0A-Z]{7}(S?).+/;
  if (expression.test(value))
    return value.replace(expression, 'Hytera $1$2');

  // RA-080, RA-160, RA-350, RA-450, RA-500, RA-900
  var expression = /^RA-..0/;
  if (expression.test(value))
    return 'Radio Activity RA-XXX';

  // KA-080, KA-160, KA-350, KA-450, KA-500, KA-900
  var expression = /^KA-..0/;
  if (expression.test(value))
    return 'Radio Activity KAIROS';

  // linux:mmdvm-20151222
  // Android:BlueSpot-v1.0.0-PA7LIM
  var expression = /\:([A-Za-z]+)-/;
  var matches = value.match(expression);
  if (matches != null)
    return matches[1];

  if ((value == '') ||
      (value == null) ||
      (value == undefined))
    return '-';

  return value;
}

function getLinkDescription(value)
{
  var descriptions =
  {
    null: '-',
    0: 'Not linked',
    1: 'Slot 1 linked',
    2: 'Slot 2 linked',
    3: 'Slot 1 &amp; 2 linked',
    4: 'Linked in DMO mode'
  };
  return descriptions[value];
}

function getFrequency(value)
{
  try           { return value.toFixed(4).replace(/0$/g, '') + ' MHz'; }
  catch (error) { return '-';                                          }
}

function newAlert (type, message) {
    $("#alert-area").append($("<div class='alert alert-" + type + " fade in' data-alert><p> " + message + " </p></div>"));
    $(".alert").delay(2000).fadeOut("slow", function () { $(this).remove(); });
}

function newAlertPopup(title,message) {
  if (config['alert'] == true) {
    $.gritter.add({
      title: title,
      text: message,
      sticky: false,
      time: ''
    });
  }
}
