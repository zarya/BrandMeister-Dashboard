function newAlert (type, message) {
    $("#alert-area").append($("<div class='alert alert-" + type + " fade in' data-alert><p> " + message + " </p></div>"));
    $(".alert").delay(2000).fadeOut("slow", function () { $(this).remove(); });
}

function newAlertPopup(title,message) {
  return function() {
    if (config['alerts'] != false) {
      $.gritter.add({
        title: title,
        text: message,
        sticky: false,
        time: ''
      });
    }
  }
}

